import { useCallback, useEffect, useRef, useState } from "react";

const NETWORK_CHECK_ENDPOINT = "/network-check";
const NETWORK_CHECK_TIMEOUT_MS = 5000;

type NetworkStatus = {
    isOnline: boolean;
    isChecking: boolean;
    retry: () => void;
};

export default function useNetworkDetector(): NetworkStatus {
    const [isOnline, setIsOnline] = useState(() => navigator.onLine);
    const [isChecking, setIsChecking] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    const checkReachability = useCallback(async () => {
        if (!navigator.onLine) {
            setIsOnline(false);
            setIsChecking(false);
            return;
        }

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const timeoutId = setTimeout(() => controller.abort(), NETWORK_CHECK_TIMEOUT_MS);
        setIsChecking(true);

        try {
            const response = await fetch(
                `${NETWORK_CHECK_ENDPOINT}?network-check=${Date.now()}`,
                {
                    cache: "no-store",
                    signal: controller.signal,
                },
            );
            clearTimeout(timeoutId);
            if (controller.signal.aborted) return;
            setIsOnline(response.ok);
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === "AbortError") return;
            setIsOnline(false);
        } finally {
            if (!controller.signal.aborted) {
                setIsChecking(false);
            }
        }
    }, []);

    useEffect(() => {
        const handleOnline = () => checkReachability();
        const handleOffline = () => {
            abortRef.current?.abort();
            setIsOnline(false);
            setIsChecking(false);
        };
        const handleVisibility = () => {
            if (!document.hidden) {
                checkReachability();
            }
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        document.addEventListener("visibilitychange", handleVisibility);

        checkReachability();

        return () => {
            abortRef.current?.abort();
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [checkReachability]);

    return { isOnline, isChecking, retry: checkReachability };
}
