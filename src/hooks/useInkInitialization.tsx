import { useEffect } from "react";
import { initializeInk } from "../utils/ink-utility";

export default function useInkInitialization() {
    useEffect(() => {
        initializeInk();
    }, []);

    return null;
}
