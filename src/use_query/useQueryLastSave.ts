import { useQuery } from "@tanstack/react-query";
import { getLastSaveFromIndexDB } from "../utilities/save-utility";

export const LAST_SAVE_USE_QUEY_KEY = "last_save_use_quey_key";

export default function useQueryLastSave() {
	return useQuery({
		queryKey: [LAST_SAVE_USE_QUEY_KEY],
		queryFn: async () => {
			return getLastSaveFromIndexDB()
				.then((res) => {
					return res || null
				}).catch((err) => {
					throw err
				})
		},
	});
}
