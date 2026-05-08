import { SKIP_DELAY } from "@/constans";
import useNarrationFunctions from "@/hooks/useNarrationFunctions";
import { AutoSettings } from "@/lib/stores/auto-settings-store";
import { SkipSettings } from "@/lib/stores/skip-settings-store";
import { TextDisplaySettings } from "@/lib/stores/text-display-settings-store";
import { useHotkeys } from "@tanstack/react-hotkeys";
import { useDebouncer } from "@tanstack/react-pacer";
import { useStore } from "@tanstack/react-store";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function useSkipAutoDetector() {
    const { t } = useTranslation(["ui"]);
    const skipEnabled = useStore(SkipSettings.store, (state) => state.enabled);
    const autoEnabled = useStore(AutoSettings.store, (state) => state.enabled);
    const autoTime = useStore(AutoSettings.store, (state) => state.time);
    const typewriterInProgress = useStore(TextDisplaySettings.store, (state) => state.inProgress);
    const { goNext } = useNarrationFunctions();

    const savedGoNext = useRef(goNext);
    useEffect(() => {
        savedGoNext.current = goNext;
    }, [goNext]);
    useEffect(() => {
        if (skipEnabled) {
            const id = setInterval(() => savedGoNext.current(), SKIP_DELAY);
            return () => clearInterval(id);
        }
    }, [skipEnabled]);

    const autoDebouncer = useDebouncer(
        () => {
            goNext();
        },
        {
            wait: autoTime * 1000,
            enabled: autoEnabled && !skipEnabled && !typewriterInProgress,
        },
    );

    useEffect(() => {
        autoDebouncer.maybeExecute();
    }, [autoEnabled, skipEnabled, typewriterInProgress, autoTime]);

    const onSkipKeyDown = useCallback(() => SkipSettings.setEnabled(true), []);
    const onSkipKeyUp = useCallback(() => {
        SkipSettings.setEnabled(false);
        goNext();
    }, [goNext]);

    useHotkeys([
        {
            hotkey: "Enter",
            callback: onSkipKeyDown,
            options: {
                meta: {
                    name: t("skip"),
                    description: t("skip_hold_description"),
                },
            },
        },
        {
            hotkey: "Space",
            callback: onSkipKeyDown,
            options: {
                meta: {
                    name: t("skip"),
                    description: t("skip_hold_space_description"),
                },
            },
        },
        {
            hotkey: "Enter",
            callback: onSkipKeyUp,
            options: {
                eventType: "keyup",
                meta: {
                    name: t("next"),
                    description: t("skip_release_description"),
                },
            },
        },
        {
            hotkey: "Space",
            callback: onSkipKeyUp,
            options: {
                eventType: "keyup",
                meta: {
                    name: t("next"),
                    description: t("skip_release_space_description"),
                },
            },
        },
    ]);

    return null;
}
