import { useHotkeys } from "@tanstack/react-hotkeys";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { SKIP_DELAY } from "../constans";
import useAutoInfoStore from "../stores/useAutoInfoStore";
import useSkipStore from "../stores/useSkipStore";
import useTypewriterStore from "../stores/useTypewriterStore";
import useDebouncedEffect from "./useDebouncedEffect";
import useInterval from "./useInterval";
import useNarrationFunctions from "./useNarrationFunctions";

export default function useSkipAutoDetector() {
    const skipEnabled = useSkipStore(useShallow((state) => state.enabled));
    const setSkipEnabled = useSkipStore((state) => state.setEnabled);
    const autoEnabled = useAutoInfoStore(useShallow((state) => state.enabled));
    const autoTime = useAutoInfoStore(useShallow((state) => state.time));
    const typewriterInProgress = useTypewriterStore(useShallow((state) => state.inProgress));
    const { goNext } = useNarrationFunctions();

    useInterval(goNext, {
        delay: SKIP_DELAY,
        enabled: skipEnabled,
    });

    useDebouncedEffect(
        () => autoEnabled && !skipEnabled && goNext(),
        {
            delay: autoTime * 1000,
            enabled: autoEnabled && !skipEnabled && !typewriterInProgress,
        },
        [autoEnabled, skipEnabled, goNext],
    );

    const onSkipKeyDown = useCallback(() => setSkipEnabled(true), [setSkipEnabled]);
    const onSkipKeyUp = useCallback(() => {
        setSkipEnabled(false);
        goNext();
    }, [setSkipEnabled, goNext]);

    useHotkeys([
        { hotkey: "Enter", callback: onSkipKeyDown },
        { hotkey: "Space", callback: onSkipKeyDown, options: { preventDefault: true } },
        { hotkey: "Enter", callback: onSkipKeyUp, options: { eventType: "keyup" } },
        { hotkey: "Space", callback: onSkipKeyUp, options: { eventType: "keyup", preventDefault: true } },
    ]);

    return null;
}
