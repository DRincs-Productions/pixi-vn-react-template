import { useHotkeys } from "@tanstack/react-hotkeys";
import { useDebouncer } from "@tanstack/react-pacer";
import { useStore } from "@tanstack/react-store";
import { useCallback, useEffect } from "react";
import { SKIP_DELAY } from "../constans";
import { AutoInfoStore } from "../stores/useAutoInfoStore";
import { SkipStore } from "../stores/useSkipStore";
import { TypewriterStore } from "../stores/useTypewriterStore";
import useInterval from "./useInterval";
import useNarrationFunctions from "./useNarrationFunctions";

export default function useSkipAutoDetector() {
    const skipEnabled = useStore(SkipStore.store, (state) => state.enabled);
    const autoEnabled = useStore(AutoInfoStore.store, (state) => state.enabled);
    const autoTime = useStore(AutoInfoStore.store, (state) => state.time);
    const typewriterInProgress = useStore(TypewriterStore.store, (state) => state.inProgress);
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

    const onSkipKeyDown = useCallback(() => SkipStore.setEnabled(true), []);
    const onSkipKeyUp = useCallback(() => {
        SkipStore.setEnabled(false);
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
