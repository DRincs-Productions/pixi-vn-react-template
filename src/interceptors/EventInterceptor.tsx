import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { hideInterfaceState } from '../atoms/hideInterfaceState';
import { reloadInterfaceDataEventAtom } from '../atoms/reloadInterfaceDataEventAtom';
import { addRefreshSave, loadRefreshSave } from '../utility/ActionsUtility';
import { useMyNavigate } from '../utility/useMyNavigate';

export default function EventInterceptor() {
    const notifyLoadEvent = useSetRecoilState(reloadInterfaceDataEventAtom);
    const [hideInterface, setHideInterface] = useRecoilState(hideInterfaceState);
    const navigate = useMyNavigate();

    useEffect(() => {
        loadRefreshSave(navigate).then(() => notifyLoadEvent((prev) => prev + 1))
        window.addEventListener("beforeunload", addRefreshSave);
        window.addEventListener("popstate", onpopstate);
        window.addEventListener('keydown', onkeydown);

        return () => {
            window.removeEventListener("beforeunload", addRefreshSave);
            window.removeEventListener("popstate", onpopstate);
            window.removeEventListener('keydown', onkeydown);
        };
    }, []);

    function onpopstate() {
        window.history.forward();
    }

    function onkeydown(event: KeyboardEvent) {
        if (event.code == 'Enter' || event.code == 'Space') {
            if (hideInterface) {
                setHideInterface(false)
            }
        }
        else if (event.code == 'KeyV' && event.shiftKey) {
            setHideInterface((prev) => !prev)
        }
    }

    return null
}
