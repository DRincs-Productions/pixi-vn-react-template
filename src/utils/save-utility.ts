import { canvas, Game } from "@drincs/pixi-vn";
import { NavigateFunction } from "react-router-dom";
import { LOADING_ROUTE, MAIN_MENU_ROUTE, NARRATION_ROUTE, REFRESH_SAVE_LOCAL_STORAGE_KEY } from "../constans";
import GameSaveData from "../models/GameSaveData";
import {
    deleteRowFromIndexDB,
    getLastRowFromIndexDB,
    getListFromIndexDB,
    getRowFromIndexDB,
    INDEXED_DB_SAVE_TABLE,
    putRowIntoIndexDB,
} from "./indexedDB-utility";

const SAVE_FILE_EXTENSION = "json";

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

export async function loadSave(saveData: GameSaveData, navigate: NavigateFunction) {
    await navigate(LOADING_ROUTE);
    await Game.restoreGameState(saveData.saveData, navigate);
}

export async function saveGameToIndexDB(
    info: Partial<GameSaveData> & { id?: number } = {},
    data = createGameSave()
): Promise<GameSaveData & { id: number }> {
    const { image = await canvas.extractImage(), ...rest } = info;
    let item = {
        ...data,
        image: image,
        ...rest,
    };
    if (item.id === undefined) {
        let lastSave = await getLastRowFromIndexDB<GameSaveData & { id: number }>(INDEXED_DB_SAVE_TABLE);
        if (lastSave) {
            item.id = lastSave.id + 1;
        } else {
            item.id = 0;
        }
    }
    await putRowIntoIndexDB(INDEXED_DB_SAVE_TABLE, item);
    if (item.id) {
        return item as GameSaveData & { id: number };
    }
    return (await getLastSaveFromIndexDB()) as GameSaveData & { id: number };
}

export async function getSaveFromIndexDB(id: number): Promise<(GameSaveData & { id: number }) | null> {
    return await getRowFromIndexDB(INDEXED_DB_SAVE_TABLE, id);
}

export async function getLastSaveFromIndexDB(): Promise<(GameSaveData & { id: number }) | null> {
    let list = await getListFromIndexDB<GameSaveData & { id: number }>(INDEXED_DB_SAVE_TABLE, {
        pagination: { limit: 1, offset: 0 },
        order: { field: "date", direction: "prev" },
    });
    if (list.length > 0) {
        return list[0];
    }
    return null;
}

export async function deleteSaveFromIndexDB(id: number): Promise<void> {
    return await deleteRowFromIndexDB(INDEXED_DB_SAVE_TABLE, id);
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

export function loadGameSaveFromFile(navigate: NavigateFunction, afterLoad?: () => void) {
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
                navigate(LOADING_ROUTE);
                let data: GameSaveData = JSON.parse(jsonString);
                // load the save data from the JSON string
                loadSave(data, navigate)
                    .then(() => {
                        afterLoad && afterLoad();
                    })
                    .catch(() => {
                        navigate(NARRATION_ROUTE);
                    });
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

export async function addRefreshSave() {
    const data = createGameSave();
    let jsonString = JSON.stringify(data);
    if (jsonString) {
        localStorage.setItem(REFRESH_SAVE_LOCAL_STORAGE_KEY, jsonString);
    }
}

export async function loadRefreshSave(navigate: NavigateFunction) {
    const jsonString = localStorage.getItem(REFRESH_SAVE_LOCAL_STORAGE_KEY);
    if (jsonString) {
        navigate(LOADING_ROUTE);
        let data: GameSaveData = JSON.parse(jsonString);

        return loadSave(data, navigate)
            .then(() => {
                localStorage.removeItem(REFRESH_SAVE_LOCAL_STORAGE_KEY);
            })
            .catch(() => {
                navigate(MAIN_MENU_ROUTE);
            });
    } else {
        navigate(MAIN_MENU_ROUTE);
    }
}
