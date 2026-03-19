import { getLastSaveFromIndexDB } from "@/lib/save-utils";
import { useQuery } from "@tanstack/react-query";

export const LAST_SAVE_USE_QUEY_KEY = "last_save_use_quey_key";

export default function useQueryLastSave() {
    return useQuery({
        queryKey: [LAST_SAVE_USE_QUEY_KEY],
        queryFn: async () => (await getLastSaveFromIndexDB()) || null,
    });
}
