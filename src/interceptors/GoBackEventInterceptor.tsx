import { useCallback, useEffect } from 'react';

export default function GoBackEventInterceptor() {
    const onpopstate = useCallback(() => {
        window.history.forward();
    }, [])

    useEffect(() => {
        window.addEventListener("popstate", onpopstate);

        return () => {
            window.removeEventListener("popstate", onpopstate);
        };
    }, [onpopstate]);

    return null
}
