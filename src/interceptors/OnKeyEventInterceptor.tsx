import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { hideInterfaceState } from '../atoms/hideInterfaceState';

export default function EventInterceptor() {
    const [hideInterface, setHideInterface] = useRecoilState(hideInterfaceState);

    useEffect(() => {
        window.addEventListener('keydown', onkeydown);

        return () => {
            window.removeEventListener('keydown', onkeydown);
        };
    }, []);

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
