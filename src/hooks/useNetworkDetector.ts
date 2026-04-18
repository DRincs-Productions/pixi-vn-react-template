import { useEffect } from "react";
import { useStore } from "@tanstack/react-store";
import { NetworkStore } from "../lib/stores/useNetworkStore";

const NETWORK_CHECK_INTERVAL_MS = 60000;
const NETWORK_CHECK_ENDPOINT = "/favicon.svg";

export default function useNetworkDetector() {
    const checkRequestId = useStore(NetworkStore.store, (state) => state.checkRequestId);

    useEffect(() => {
        const handleOnline = () => NetworkStore.requestCheck();
        const handleOffline = () => NetworkStore.markOffline();
        const handleVisibility = () => {
            if (!document.hidden) {
                NetworkStore.syncWithNavigator();
            }
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        document.addEventListener("visibilitychange", handleVisibility);

        const periodicCheck = window.setInterval(() => {
            NetworkStore.syncWithNavigator();
        }, NETWORK_CHECK_INTERVAL_MS);

        NetworkStore.syncWithNavigator();

        return () => {
            window.clearInterval(periodicCheck);
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, []);

    useEffect(() => {
        if (!navigator.onLine) {
            NetworkStore.markOffline();
            return;
        }

        const requestId = checkRequestId;
        let isUnmounted = false;
        const controller = new AbortController();
        NetworkStore.markChecking();

        const checkReachability = async () => {
            try {
                const response = await fetch(
                    `${NETWORK_CHECK_ENDPOINT}?network-check=${Date.now()}`,
                    {
                        cache: "no-store",
                        signal: controller.signal,
                    },
                );
                if (isUnmounted) return;
                if (requestId !== NetworkStore.store.state.checkRequestId) return;
                NetworkStore.setNetworkReachability(response.ok);
            } catch (error) {
                if (isUnmounted) return;
                if (error instanceof Error && error.name === "AbortError") return;
                if (requestId !== NetworkStore.store.state.checkRequestId) return;
                NetworkStore.setNetworkReachability(false);
            }
        };

        checkReachability();

        return () => {
            isUnmounted = true;
            controller.abort();
        };
    }, [checkRequestId]);

    return null;
}
