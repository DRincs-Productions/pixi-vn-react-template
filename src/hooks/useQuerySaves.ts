import { getSaveFromIndexDB } from "@/lib/save-utils";
import { useQuery } from "@tanstack/react-query";

export const SAVES_USE_QUEY_KEY = "saves_use_quey_key";

export default function useQuerySaves({ id }: { id: number }) {
    return useQuery({
        queryKey: [SAVES_USE_QUEY_KEY, id],
        queryFn: async () => (await getSaveFromIndexDB(id)) || null,
    });
}
