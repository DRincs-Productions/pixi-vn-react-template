import { useHotkeys } from "@tanstack/react-hotkeys";
import { useDebouncer } from "@tanstack/react-pacer";
import { useStore } from "@tanstack/react-store";
import { useCallback, useEffect } from "react";
import { SKIP_DELAY } from "../constans";
import { autoInfoStore } from "../stores/useAutoInfoStore";
import { setSkipEnabled, skipStore } from "../stores/useSkipStore";
import { typewriterStore } from "../stores/useTypewriterStore";
import useInterval from "./useInterval";
import useNarrationFunctions from "./useNarrationFunctions";

export default function useSkipAutoDetector() {
    const skipEnabled = useStore(skipStore, (state) => state.enabled);
    const autoEnabled = useStore(autoInfoStore, (state) => state.enabled);
    const autoTime = useStore(autoInfoStore, (state) => state.time);
    const typewriterInProgress = useStore(typewriterStore, (state) => state.inProgress);
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

    const onSkipKeyDown = useCallback(() => setSkipEnabled(true), [setSkipEnabled]);
    const onSkipKeyUp = useCallback(() => {
        setSkipEnabled(false);
        goNext();
    }, [setSkipEnabled, goNext]);

    useHotkeys([
        { hotkey: "Enter", callback: onSkipKeyDown },
        { hotkey: "Space", callback: onSkipKeyDown },
        { hotkey: "Enter", callback: onSkipKeyUp, options: { eventType: "keyup" } },
        { hotkey: "Space", callback: onSkipKeyUp, options: { eventType: "keyup" } },
    ]);

    return null;
}
