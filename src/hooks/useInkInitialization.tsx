import { useEffect } from "react";
import { initializeInk } from "../utils/ink-utility";
import useMyNavigate from "./useMyNavigate";

export default function useInkInitialization() {
    const navigate = useMyNavigate();

    useEffect(() => {
        initializeInk({ navigate });
    }, []);

    return null;
}
