import { narration } from "@drincs/pixi-vn";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useAutoInfoStore from "../stores/useAutoInfoStore";
import useSkipStore from "../stores/useSkipStore";
import useStepStore from "../stores/useStepStore";
import useTypewriterStore from "../stores/useTypewriterStore";
import { INTERFACE_DATA_USE_QUEY_KEY } from "../use_query/useQueryInterface";
import { useMyNavigate } from "../utils/navigate-utility";

export default function useSkipAutoDetector() {
    const navigate = useMyNavigate();
    const { t: tNarration } = useTranslation(["narration"]);
    const skipEnabled = useSkipStore((state) => state.enabled);
    const autoEnabled = useAutoInfoStore((state) => state.enabled);
    const autoTime = useAutoInfoStore((state) => state.time);
    const typewriterInProgress = useTypewriterStore((state) => state.inProgress);
    const [recheckSkip, setRecheckSkip] = useState<number>(0);
    const { enqueueSnackbar } = useSnackbar();
    const setNextStepLoading = useStepStore((state) => state.setLoading);
    const queryClient = useQueryClient();

    const nextOnClick = useCallback(async () => {
        setNextStepLoading(true);
        try {
            if (!narration.canGoNext) {
                setNextStepLoading(false);
                return;
            }
            narration
                .goNext({
                    t: tNarration,
                    navigate,
                    notify: (message, variant) => enqueueSnackbar(message, { variant }),
                })
                .then(() => {
                    queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] });
                    setNextStepLoading(false);
                })
                .catch((e) => {
                    setNextStepLoading(false);
                    console.error(e);
                });
            return;
        } catch (e) {
            setNextStepLoading(false);
            console.error(e);
            return;
        }
    }, [tNarration, queryClient]);

    useEffect(() => {
        // Debouncing
        let timeout = setTimeout(() => {
            if (skipEnabled) {
                nextOnClick().then(() => {
                    setRecheckSkip((p) => p + 1);
                });
            }
        }, 400);

        return () => {
            clearTimeout(timeout);
        };
    }, [skipEnabled, recheckSkip, nextOnClick]);

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
                        nextOnClick();
                    }
                }, millisecond);

                return () => {
                    clearTimeout(timeout);
                };
            }
        }
    }, [autoTime, autoEnabled, typewriterInProgress, skipEnabled, nextOnClick]);

    return null;
}
