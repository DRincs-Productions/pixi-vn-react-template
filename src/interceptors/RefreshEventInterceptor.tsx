import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LOADING_ROUTE, MAIN_MENU_ROUTE } from '../constans';
import { INTERFACE_DATA_USE_QUEY_KEY } from '../use_query/useQueryInterface';
import { useMyNavigate } from '../utilities/navigate-utility';
import { addRefreshSave, loadRefreshSave } from '../utilities/save-utility';

export default function RefreshSaveEventInterceptor() {
    const navigate = useMyNavigate();
    const queryClient = useQueryClient()
    const location = useLocation();

    const beforeunload = useCallback(async () => {
        if (location.pathname === MAIN_MENU_ROUTE || location.pathname === LOADING_ROUTE) {
            return
        }
        await addRefreshSave()
    }, [location])

    useEffect(() => {
        window.addEventListener("beforeunload", beforeunload);

        return () => {
            window.removeEventListener("beforeunload", beforeunload);
        };
    }, [beforeunload]);

    useEffect(() => {
        loadRefreshSave(navigate).then(() => queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] }))
    }, []);

    return null
}
