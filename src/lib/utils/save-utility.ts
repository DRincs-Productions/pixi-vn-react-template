import { gameDB, INDEXED_DB_SAVE_TABLE } from "@/lib/utils/db-utility";
import { roves } from "@/lib/utils/roves-utility";
import type GameSaveData from "@/models/GameSaveData";
import { canvas, Game } from "@drincs/pixi-vn";
import { isAvailable as isRoves } from "@drincs/roves-api/core";
import { saves as rovesSaves } from "@drincs/roves-api/saves";

const SAVE_FILE_EXTENSION = "json";
const AUTO_EXIT_SAVE_LOCAL_STORAGE_KEY = "auto_exit_save";

/**
 * Quick saves live in a fixed, reserved range of negative ids (`-2`, `-3`, ...) so they
 * never collide with the auto-incrementing ids used by manual saves (`0`, `1`, ...) or
 * with the `-1` id reserved for the "auto exit save" (see {@link getLastSaveFromIndexDB}).
 */
const QUICK_SAVE_ID_START = -2;
/** Number of quick-save slots. */
const QUICK_SAVE_SLOTS = 6;

function getQuickSaveId(slotIndex: number): number {
    return QUICK_SAVE_ID_START - slotIndex;
}

export function getQuickSaveIds(): number[] {
    return Array.from({ length: QUICK_SAVE_SLOTS }, (_, index) => getQuickSaveId(index));
}

export function isQuickSaveId(id: number): boolean {
    return id <= QUICK_SAVE_ID_START;
}

/** 1-based slot number for a quick-save id, for display purposes. */
export function getQuickSaveSlotNumber(id: number): number {
    return QUICK_SAVE_ID_START - id + 1;
}

/** Human-readable label for a save slot, e.g. "File 01" or "Quick Save 2". */
export function getSaveSlotLabel(id: number, t: (key: string) => string): string {
    if (isQuickSaveId(id)) {
        return `${t("quick_save")} ${getQuickSaveSlotNumber(id)}`;
    }
    return `${t("save_slot")} ${String(id + 1).padStart(2, "0")}`;
}

export function createGameSave(options?: { image?: string; name?: string }): GameSaveData {
    const { image, name = "" } = options || {};
    return {
        saveData: Game.exportGameState(),
        gameVersion: __APP_VERSION__,
        date: new Date(),
        name: name,
        image: image,
    };
}

export async function loadSave(saveData: GameSaveData) {
    await Game.restoreGameState(saveData.saveData);
}

export async function saveGameToIndexDB(
    info: Partial<GameSaveData> & { id?: number } = {},
    data = createGameSave(),
): Promise<GameSaveData & { id: number }> {
    const { image = await canvas.extractImage(), ...rest } = info;
    const item = {
        ...data,
        image: image,
        ...rest,
    };
    const usingRoves = isRoves();
    if (item.id === undefined) {
        if (usingRoves) {
            const maxId = await roves.getMaxSaveId();
            item.id = maxId === null ? 0 : maxId + 1;
        } else {
            const lastSave = await gameDB.getLastRow<GameSaveData & { id: number }>(
                INDEXED_DB_SAVE_TABLE,
            );
            item.id = lastSave ? lastSave.id + 1 : 0;
        }
    }

    if (usingRoves) {
        await rovesSaves.writeText(item.id, item);
        return item as GameSaveData & { id: number };
    }

    await gameDB.putRow(INDEXED_DB_SAVE_TABLE, item);
    if (item.id) {
        return item as GameSaveData & { id: number };
    }
    return (await getLastSaveFromIndexDB()) as GameSaveData & { id: number };
}

/**
 * Saves into the dedicated quick-save slots (see {@link getQuickSaveIds}). Fills the first
 * empty slot; once all slots are full, overwrites the least recently saved one.
 */
export async function quickSaveGameToIndexDB(): Promise<GameSaveData & { id: number }> {
    const ids = getQuickSaveIds();
    const slots = await Promise.all(ids.map((id) => getSaveFromIndexDB(id)));

    let targetIndex = slots.findIndex((slot) => !slot);
    if (targetIndex === -1) {
        targetIndex = 0;
        for (let index = 1; index < slots.length; index++) {
            const slot = slots[index];
            const oldest = slots[targetIndex];
            if (slot && oldest && new Date(slot.date) < new Date(oldest.date)) {
                targetIndex = index;
            }
        }
    }

    return saveGameToIndexDB({ id: ids[targetIndex] });
}

export async function getSaveFromIndexDB(
    id: number,
): Promise<(GameSaveData & { id: number }) | null> {
    if (isRoves()) {
        return roves.getSave(id);
    }
    return await gameDB.getRow(INDEXED_DB_SAVE_TABLE, id);
}

export async function getLastSaveFromIndexDB(): Promise<(GameSaveData & { id: number }) | null> {
    const backendSave = isRoves()
        ? await roves.getMostRecentSave()
        : ((
              await gameDB.getList<GameSaveData & { id: number }>(INDEXED_DB_SAVE_TABLE, {
                  pagination: { limit: 1, offset: 0 },
                  order: { field: "date", direction: "prev" },
              })
          )[0] ?? null);

    const autoExitJsonString = localStorage.getItem(AUTO_EXIT_SAVE_LOCAL_STORAGE_KEY);
    if (autoExitJsonString) {
        const autoExitSave: GameSaveData & { id: number } = {
            ...(JSON.parse(autoExitJsonString) as GameSaveData),
            id: -1,
        };
        if (!backendSave || new Date(autoExitSave.date) > new Date(backendSave.date)) {
            return autoExitSave;
        }
    }

    return backendSave;
}

export async function deleteSaveFromIndexDB(id: number): Promise<unknown> {
    if (isRoves()) {
        return await rovesSaves.delete(id);
    }
    return await gameDB.deleteRow(INDEXED_DB_SAVE_TABLE, id);
}

export function downloadGameSave(data: GameSaveData = createGameSave()) {
    const jsonString = JSON.stringify(data);
    // download the save data as a JSON file
    const blob = new Blob([jsonString], { type: "application/json" });
    // download the file
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${__APP_NAME__}-${__APP_VERSION__}-${data.name} ${data.date.toISOString()}.${SAVE_FILE_EXTENSION}`;
    a.click();
}

export function loadGameSaveFromFile(afterLoad?: (error?: Error) => void) {
    // load the save data from a JSON file
    const input = document.createElement("input");
    input.type = "file";
    input.accept = `application/${SAVE_FILE_EXTENSION}`;
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const jsonString = e.target?.result as string;
                const data: GameSaveData = JSON.parse(jsonString);
                // load the save data from the JSON string
                loadSave(data)
                    .then(() => {
                        afterLoad?.();
                    })
                    .catch((err) => {
                        afterLoad?.(err);
                    });
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// Note: the auto-exit save intentionally always stays in localStorage, regardless of the
// save storage backend above, since it's a same-page fast path read on every route load.
export async function addAutoExitSave() {
    const data = createGameSave();
    const jsonString = JSON.stringify(data);
    if (jsonString) {
        localStorage.setItem(AUTO_EXIT_SAVE_LOCAL_STORAGE_KEY, jsonString);
    }
}

export async function loadAutoExitSave(): Promise<boolean> {
    const jsonString = localStorage.getItem(AUTO_EXIT_SAVE_LOCAL_STORAGE_KEY);
    if (jsonString) {
        const data: GameSaveData = JSON.parse(jsonString);

        return loadSave(data)
            .then(() => {
                localStorage.removeItem(AUTO_EXIT_SAVE_LOCAL_STORAGE_KEY);
                return true;
            })
            .catch(() => {
                Game.clear();
                return false;
            });
    } else {
        return false;
    }
}
