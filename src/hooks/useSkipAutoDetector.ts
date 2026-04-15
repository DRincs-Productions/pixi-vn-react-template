import { useHotkeys } from "@tanstack/react-hotkeys";
import { useDebouncer } from "@tanstack/react-pacer";
import { useStore } from "@tanstack/react-store";
import { useCallback, useEffect } from "react";
import { SKIP_DELAY } from "../constans";
import { AutoSettings } from "../lib/stores/auto-settings-store";
import { SkipSettings } from "../lib/stores/skip-settings-store";
import { TextDisplaySettings } from "../lib/stores/text-display-settings-store";
import useInterval from "./useInterval";
import useNarrationFunctions from "./useNarrationFunctions";

export default function useSkipAutoDetector() {
    const skipEnabled = useStore(SkipSettings.store, (state) => state.enabled);
    const autoEnabled = useStore(AutoSettings.store, (state) => state.enabled);
    const autoTime = useStore(AutoSettings.store, (state) => state.time);
    const typewriterInProgress = useStore(TextDisplaySettings.store, (state) => state.inProgress);
    const { goNext } = useNarrationFunctions();

    useInterval(goNext, {
        delay: SKIP_DELAY,
        enabled: skipEnabled,
    });

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
        { hotkey: "Enter", callback: onSkipKeyDown },
        { hotkey: "Space", callback: onSkipKeyDown },
        { hotkey: "Enter", callback: onSkipKeyUp, options: { eventType: "keyup" } },
        { hotkey: "Space", callback: onSkipKeyUp, options: { eventType: "keyup" } },
    ]);

    return null;
}
