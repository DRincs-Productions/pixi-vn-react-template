import { useCallback, useEffect, useState } from "react";

type NetworkStatus = {
    isOnline: boolean;
    retry: () => void;
};

export default function useNetworkDetector(): NetworkStatus {
    const [isOnline, setIsOnline] = useState(() => navigator.onLine);

    const checkOnline = useCallback(() => {
        setIsOnline(navigator.onLine);
    }, []);

    useEffect(() => {
        const handleVisibility = () => {
            if (!document.hidden) {
                checkOnline();
            }
        };

        window.addEventListener("online", checkOnline);
        window.addEventListener("offline", checkOnline);
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            window.removeEventListener("online", checkOnline);
            window.removeEventListener("offline", checkOnline);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [checkOnline]);

    return { isOnline, retry: checkOnline };
}
