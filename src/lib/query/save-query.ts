import { getLastSaveFromIndexDB, getSaveFromIndexDB } from "@/lib/utils/save-utility";
import { useQuery } from "@tanstack/react-query";

export const SAVES_USE_QUEY_KEY = "saves_use_quey_key";
export function useQuerySaves({ id }: { id: number }) {
    return useQuery({
        queryKey: [SAVES_USE_QUEY_KEY, id],
        queryFn: async () => (await getSaveFromIndexDB(id)) || null,
    });
}

export const LAST_SAVE_USE_QUEY_KEY = "last_save_use_quey_key";
export function useQueryLastSave() {
    return useQuery({
        queryKey: [LAST_SAVE_USE_QUEY_KEY],
        queryFn: async () => (await getLastSaveFromIndexDB()) || null,
    });
}
