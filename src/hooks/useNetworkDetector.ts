import { useEffect } from "react";
import useNetworkStore from "../stores/useNetworkStore";

export default function useNetworkDetector() {
    const update = useNetworkStore((state) => state.updateOnlineStatus);

    useEffect(() => {
        window.addEventListener("online", update);
        window.addEventListener("offline", update);

        return () => {
            window.removeEventListener("online", update);
            window.removeEventListener("offline", update);
        };
    }, []);

    return null;
}
