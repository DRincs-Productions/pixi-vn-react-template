import { canvas, getSaveData, loadSaveData } from "@drincs/pixi-vn";
import GameSaveData from "../models/GameSaveData";
import { deleteRowFromIndexDB, getLastRowFromIndexDB, getListFromIndexDB, getRowFromIndexDB, INDEXED_DB_SAVE_TABLE, putRowIntoIndexDB } from "./indexedDB-utility";

const SAVE_FILE_EXTENSION = "json"

export function getSave(image?: string): GameSaveData {
    return {
        saveData: getSaveData(),
        gameVersion: __APP_VERSION__,
        date: new Date(),
        name: "",
        image: image
    }
}

export async function loadSave(saveData: GameSaveData, navigate: (path: string) => void) {
    navigate("/loading")
    // load the save data from the JSON string
    await loadSaveData(saveData.saveData, navigate)
}

export async function putSaveIntoIndexDB(info: Partial<GameSaveData> & { id?: number } = {}, data = getSave()): Promise<GameSaveData & { id: number }> {
    let image = await canvas.extractImage()
    let item = {
        ...data,
        image: image,
        ...info,
    }
    if (item.id === undefined) {
        let lastSave = await getLastRowFromIndexDB<GameSaveData & { id: number }>(INDEXED_DB_SAVE_TABLE)
        if (lastSave) {
            item.id = lastSave.id + 1
        }
        else {
            item.id = 0
        }
    }
    await putRowIntoIndexDB(INDEXED_DB_SAVE_TABLE, item)
    if (item.id) {
        return item as GameSaveData & { id: number }
    }
    return await getLastSaveFromIndexDB() as GameSaveData & { id: number }
}

export async function getSaveFromIndexDB(id: number): Promise<GameSaveData & { id: number } | null> {
    return await getRowFromIndexDB(INDEXED_DB_SAVE_TABLE, id)
}

export async function getLastSaveFromIndexDB(): Promise<GameSaveData & { id: number } | null> {
    let list = await getListFromIndexDB<GameSaveData & { id: number }>(INDEXED_DB_SAVE_TABLE, { pagination: { limit: 1, offset: 0 }, order: { field: "date", direction: "prev" } })
    if (list.length > 0) {
        return list[0]
    }
    return null
}

export async function deleteSaveFromIndexDB(id: number): Promise<void> {
    return await deleteRowFromIndexDB(INDEXED_DB_SAVE_TABLE, id)
}

export function downloadGameSave(data: GameSaveData = getSave()) {
    const jsonString = JSON.stringify(data);
    // download the save data as a JSON file
    const blob = new Blob([jsonString], { type: "application/json" });
    // download the file
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${__APP_NAME__}-${__APP_VERSION__}-${data.name} ${data.date.toISOString()}.${SAVE_FILE_EXTENSION}`;
    a.click();
}

export function loadGameSaveFromFile(navigate: (path: string) => void, afterLoad?: () => void) {
    // load the save data from a JSON file
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = `application/${SAVE_FILE_EXTENSION}`;
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const jsonString = e.target?.result as string;
                navigate("/loading")
                let data: GameSaveData = JSON.parse(jsonString)
                // load the save data from the JSON string
                loadSave(data, navigate)
                    .then(() => {
                        afterLoad && afterLoad();
                    }).catch(() => {
                        navigate("/narration")
                    })
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

export async function addRefreshSave() {
    const data = getSave()
    let jsonString = JSON.stringify(data);
    if (jsonString) {
        localStorage.setItem("refresh_save", jsonString)
    }
}

export async function loadRefreshSave(navigate: (path: string) => void) {
    const jsonString = localStorage.getItem("refresh_save")
    if (jsonString) {
        navigate("/loading")
        let data: GameSaveData = JSON.parse(jsonString)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        return loadSave(data, navigate)
            .then(() => {
                localStorage.removeItem("refreshSave")
            })
            .catch(() => {
                navigate("/")
            })
    }
    else {
        navigate("/")
    }
}
