import { useEffect } from "react";
import { updateOnlineStatus } from "../stores/useNetworkStore";

export default function useNetworkDetector() {
    useEffect(() => {
        window.addEventListener("online", updateOnlineStatus);
        window.addEventListener("offline", updateOnlineStatus);

        return () => {
            window.removeEventListener("online", updateOnlineStatus);
            window.removeEventListener("offline", updateOnlineStatus);
        };
    }, []);

    return null;
}
