import { useStore } from "@tanstack/react-store";
import { SKIP_DELAY } from "../constans";
import { autoInfoStore } from "../stores/useAutoInfoStore";
import { setEnabled as setSkipEnabled } from "../stores/useSkipStore";
import { skipStore } from "../stores/useSkipStore";
import { typewriterStore } from "../stores/useTypewriterStore";
import useDebouncedEffect from "./useDebouncedEffect";
import useInterval from "./useInterval";
import useEventListener from "./useKeyDetector";
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

    useDebouncedEffect(
        () => autoEnabled && !skipEnabled && goNext(),
        {
            delay: autoTime * 1000,
            enabled: autoEnabled && !skipEnabled && !typewriterInProgress,
        },
        [autoEnabled, skipEnabled, goNext],
    );

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
