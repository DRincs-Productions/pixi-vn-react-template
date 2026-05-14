import { initializeInk } from "@/lib/utils/ink-utility";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function useInkInitialization() {
    const { t } = useTranslation(["narration"]);
    useEffect(() => {
        initializeInk({ t });
    }, [t]);

    return null;
}
