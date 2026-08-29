import type GameSaveData from "@/models/GameSaveData";
import { saves as rovesSaves } from "@drincs/roves-api/saves";

export namespace roves {
    export async function getSave(id: number): Promise<(GameSaveData & { id: number }) | null> {
        const item = await rovesSaves.readJSON<GameSaveData & { id: number }>(id);
        if (item) {
            return { ...item, date: new Date(item.date), id };
        } else {
            return null;
        }
    }

    async function listSaveIds(): Promise<number[]> {
        const keys = await rovesSaves.list();
        return keys.map(Number);
    }

    /** The roves-backed save with the most recent `date`, across every save key. */
    export async function getMostRecentSave(): Promise<(GameSaveData & { id: number }) | null> {
        const ids = await listSaveIds();
        const entries = await Promise.all(ids.map((id) => getSave(id)));
        return entries.reduce<(GameSaveData & { id: number }) | null>((latest, entry) => {
            if (!entry) {
                return latest;
            }
            if (!latest || new Date(entry.date) > new Date(latest.date)) {
                return entry;
            }
            return latest;
        }, null);
    }
}
