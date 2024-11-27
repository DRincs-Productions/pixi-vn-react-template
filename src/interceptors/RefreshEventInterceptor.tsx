import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { INTERFACE_DATA_USE_QUEY_KEY } from '../use_query/useQueryInterface';
import { useMyNavigate } from '../utilities/navigate-utility';
import { addRefreshSave, loadRefreshSave } from '../utilities/save-utility';

export default function RefreshSaveEventInterceptor() {
    const navigate = useMyNavigate();
    const queryClient = useQueryClient()

    useEffect(() => {
        loadRefreshSave(navigate).then(() => queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] }))
        window.addEventListener("beforeunload", async () => {
            await addRefreshSave()
        });

        return () => {
            window.removeEventListener("beforeunload", async () => {
                await addRefreshSave()
            });
        };
    }, []);

    return null
}
