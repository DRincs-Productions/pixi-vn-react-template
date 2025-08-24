import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { initializeInk } from "../utils/ink-utility";

export default function useInkInitialization() {
    const { t } = useTranslation(["narration"]);
    useEffect(() => {
        initializeInk({ t });
    }, []);

    return null;
}
