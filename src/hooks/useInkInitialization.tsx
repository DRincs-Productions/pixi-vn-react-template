import { onInkTranslate } from "@drincs/pixi-vn-ink";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function useInkInitialization() {
    const { t } = useTranslation(["narration"]);
    useEffect(() => {
        onInkTranslate(t);
    }, [t]);

    return null;
}
