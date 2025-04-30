import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { initializeInk } from "../utils/ink-utility";
import useMyNavigate from "./useMyNavigate";

export default function useInkInitialization() {
    const navigate = useMyNavigate();
    const { t: tNarration } = useTranslation(["narration"]);

    useEffect(() => {
        initializeInk({ navigate, t: tNarration });
    }, []);

    return null;
}
