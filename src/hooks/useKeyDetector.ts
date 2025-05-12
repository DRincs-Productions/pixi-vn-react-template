import { useEffect } from "react";

export default function useEventListener<K extends keyof WindowEventMap>({
    type,
    listener,
}: {
    type: K;
    listener: (this: Window, ev: WindowEventMap[K]) => any;
}) {
    useEffect(() => {
        window.addEventListener(type, listener);

        return () => {
            window.removeEventListener(type, listener);
        };
    }, [onkeydown]);

    return null;
}
