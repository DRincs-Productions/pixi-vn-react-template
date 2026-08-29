import { gameDB, INDEXED_DB_SAVE_TABLE } from "@/lib/utils/db-utility";
import { roves } from "@/lib/utils/roves-utility";
import type GameSaveData from "@/models/GameSaveData";
import { canvas, Game } from "@drincs/pixi-vn";
import { isAvailable as isRoves } from "@drincs/roves-api/core";
import { saves as rovesSaves } from "@drincs/roves-api/saves";

const SAVE_FILE_EXTENSION = "json";

function create(options?: { image?: string; name?: string }): GameSaveData {
    const { image, name = "" } = options || {};
    return {
        saveData: Game.exportGameState(),
        gameVersion: __APP_VERSION__,
        date: new Date(),
        name: name,
        image: image,
    };
}

export async function save(
    info: Partial<GameSaveData> & { id: number },
    data = create(),
): Promise<GameSaveData & { id: number }> {
    const { image = await canvas.extractImage(), ...rest } = info;
    const item = {
        ...data,
        image: image,
        ...rest,
    };
    const usingRoves = isRoves();
    if (usingRoves) {
        await rovesSaves.writeText(item.id, item);
        return item as GameSaveData & { id: number };
    }

    await gameDB.putRow(INDEXED_DB_SAVE_TABLE, item);
    if (item.id) {
        return item as GameSaveData & { id: number };
    }
    return (await save.getLast()) as GameSaveData & { id: number };
}

export namespace save {
    export async function get(id: number): Promise<(GameSaveData & { id: number }) | null> {
        if (isRoves()) {
            return roves.getSave(id);
        }
        return await gameDB.getRow(INDEXED_DB_SAVE_TABLE, id);
    }

    export async function getLast(): Promise<(GameSaveData & { id: number }) | null> {
        const backendSave = isRoves()
            ? await roves.getMostRecentSave()
            : ((
                  await gameDB.getList<GameSaveData & { id: number }>(INDEXED_DB_SAVE_TABLE, {
                      pagination: { limit: 1, offset: 0 },
                      order: { field: "date", direction: "prev" },
                  })
              )[0] ?? null);

        const autoExitSave = autoExit.peek();
        if (
            autoExitSave &&
            (!backendSave || new Date(autoExitSave.date) > new Date(backendSave.date))
        ) {
            return autoExitSave;
        }

        return backendSave;
    }

    export async function remove(id: number): Promise<unknown> {
        if (isRoves()) {
            return await rovesSaves.delete(id);
        }
        return await gameDB.deleteRow(INDEXED_DB_SAVE_TABLE, id);
    }

    export function download(data: GameSaveData = create()) {
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

    export function loadFromFile(afterLoad?: (error?: Error) => void) {
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
                    restore(data)
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

    export async function restore(saveData: GameSaveData) {
        await Game.restoreGameState(saveData.saveData);
    }

    /** Human-readable label for a save slot, e.g. "File 01" or "Quick Save 2". */
    export function getSlotLabel(id: number, t: (key: string) => string): string {
        if (quickSave.isId(id)) {
            return `${t("quick_save")} ${quickSave.getSlotNumber(id)}`;
        }
        return `${t("save_slot")} ${String(id + 1).padStart(2, "0")}`;
    }
}

/**
 * Quick saves live in a fixed, reserved range of negative ids (`-2`, `-3`, ...) so they never
 * collide with the auto-incrementing ids used by manual saves (`0`, `1`, ...) or with the `-1`
 * id reserved for the auto-exit save (see {@link autoExit}).
 */
export async function quickSave(): Promise<GameSaveData & { id: number }> {
    const ids = quickSave.getIds();
    const slots = await Promise.all(ids.map((id) => save.get(id)));

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

    return save({ id: ids[targetIndex] });
}

export namespace quickSave {
    const QUICK_SAVE_ID_START = -2;
    /** Number of quick-save slots. */
    const QUICK_SAVE_SLOTS = 6;

    function idForSlot(slotIndex: number): number {
        return QUICK_SAVE_ID_START - slotIndex;
    }

    export function getIds(): number[] {
        return Array.from({ length: QUICK_SAVE_SLOTS }, (_, index) => idForSlot(index));
    }

    export function isId(id: number): boolean {
        return id <= QUICK_SAVE_ID_START;
    }

    /** 1-based slot number for a quick-save id, for display purposes. */
    export function getSlotNumber(id: number): number {
        return QUICK_SAVE_ID_START - id + 1;
    }
}

// Note: the auto-exit save intentionally always stays in localStorage, regardless of the
// save storage backend above, since it's a same-page fast path read on every route load.
export namespace autoExit {
    const AUTO_EXIT_SAVE_LOCAL_STORAGE_KEY = "auto_exit_save";

    export async function add() {
        const data = create();
        const jsonString = JSON.stringify(data);
        if (jsonString) {
            localStorage.setItem(AUTO_EXIT_SAVE_LOCAL_STORAGE_KEY, jsonString);
        }
    }

    export async function load(): Promise<boolean> {
        const jsonString = localStorage.getItem(AUTO_EXIT_SAVE_LOCAL_STORAGE_KEY);
        if (jsonString) {
            const data: GameSaveData = JSON.parse(jsonString);

            return save
                .restore(data)
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

    /** The auto-exit save, if any, without consuming it — used by {@link save.getLast}. */
    export function peek(): (GameSaveData & { id: number }) | null {
        const jsonString = localStorage.getItem(AUTO_EXIT_SAVE_LOCAL_STORAGE_KEY);
        if (!jsonString) {
            return null;
        }
        return { ...(JSON.parse(jsonString) as GameSaveData), id: -1 };
    }
}
