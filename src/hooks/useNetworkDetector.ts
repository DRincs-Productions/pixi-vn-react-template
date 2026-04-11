import { useEffect } from "react";
import { NetworkStore } from "../lib/stores/useNetworkStore";

export default function useNetworkDetector() {
    useEffect(() => {
        window.addEventListener("online", NetworkStore.updateOnlineStatus);
        window.addEventListener("offline", NetworkStore.updateOnlineStatus);

        return () => {
            window.removeEventListener("online", NetworkStore.updateOnlineStatus);
            window.removeEventListener("offline", NetworkStore.updateOnlineStatus);
        };
    }, []);

    return null;
}
