import { useEffect } from 'react';

export default function GoBackEventInterceptor() {
    useEffect(() => {
        window.addEventListener("popstate", onpopstate);

        return () => {
            window.removeEventListener("popstate", onpopstate);
        };
    }, []);

    function onpopstate() {
        window.history.forward();
    }

    return null
}
