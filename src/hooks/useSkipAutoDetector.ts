import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { SKIP_DELAY } from "../constans";
import useAutoInfoStore from "../stores/useAutoInfoStore";
import useSkipStore from "../stores/useSkipStore";
import useTypewriterStore from "../stores/useTypewriterStore";
import useInterval from "./useInterval";
import useEventListener from "./useKeyDetector";
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

    useEffect(() => {
        if (skipEnabled) {
            return;
        }
        if (autoEnabled && !typewriterInProgress) {
            if (autoTime) {
                let millisecond = autoTime * 1000;
                // Debouncing
                let timeout = setTimeout(() => {
                    if (autoEnabled && !skipEnabled) {
                        goNext();
                    }
                }, millisecond);

                return () => {
                    clearTimeout(timeout);
                };
            }
        }
    }, [autoTime, autoEnabled, typewriterInProgress, skipEnabled, goNext]);

    useEventListener({
        type: "keypress",
        listener: (event) => {
            if (event.code == "Enter" || event.code == "Space") {
                setSkipEnabled(true);
            }
        },
    });
    useEventListener({
        type: "keyup",
        listener: (event) => {
            if (event.code == "Enter" || event.code == "Space") {
                setSkipEnabled(false);
                goNext();
            }
        },
    });

    return null;
}
