import { narration } from '@drincs/pixi-vn';
import { Button } from '@mui/joy';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from "motion/react";
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useEventListener from '../hooks/useKeyDetector';
import useInterfaceStore from '../stores/useInterfaceStore';
import useSkipStore from '../stores/useSkipStore';
import useStepStore from '../stores/useStepStore';
import { INTERFACE_DATA_USE_QUEY_KEY, useQueryCanGoNext } from '../use_query/useQueryInterface';
import { useMyNavigate } from '../utils/navigate-utility';

export default function NextButton() {
    const skipEnabled = useSkipStore((state) => state.enabled)
    const setSkipEnabled = useSkipStore((state) => state.setEnabled)
    const nextStepLoading = useStepStore((state) => state.loading);
    const { data: canGoNext = false } = useQueryCanGoNext()
    const hideNextButton = useInterfaceStore((state) => state.hidden || !canGoNext);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useMyNavigate();
    const { t } = useTranslation(["ui"]);
    const { t: tNarration } = useTranslation(["narration"]);
    const setNextStepLoading = useStepStore((state) => state.setLoading);
    const queryClient = useQueryClient()

    const nextOnClick = useCallback(async () => {
        setNextStepLoading(true);
        try {
            if (!narration.canGoNext) {
                setNextStepLoading(false);
                return;
            }
            narration.goNext({
                t: tNarration,
                navigate,
                notify: (message, variant) => enqueueSnackbar(message, { variant }),
            })
                .then(() => {
                    queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] })
                    setNextStepLoading(false);
                })
                .catch((e) => {
                    setNextStepLoading(false);
                    console.error(e);
                })
            return;
        } catch (e) {
            setNextStepLoading(false);
            console.error(e);
            return;
        }
    }, [tNarration, queryClient])

    useEventListener({
        type: 'keypress',
        listener: (event) => {
            if ((event.code == 'Enter' || event.code == 'Space')) {
                setSkipEnabled(true)
            }
        }
    })
    useEventListener({
        type: 'keyup',
        listener: (event) => {
            if ((event.code == 'Enter' || event.code == 'Space')) {
                setSkipEnabled(false)
                nextOnClick()
            }
        }
    })

    return (
        <Button
            variant="solid"
            color="primary"
            size="sm"
            loading={nextStepLoading}
            sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: { xs: 70, sm: 100, md: 150 },
                border: 3,
                zIndex: 100,
            }}
            onClick={() => {
                if (skipEnabled) {
                    setSkipEnabled(false)
                }
                nextOnClick()
            }}
            component={motion.div}
            variants={{
                open: {
                    opacity: 1,
                    pointerEvents: "auto",
                },
                closed: {
                    opacity: 0,
                    pointerEvents: "none",
                }
            }}
            initial={"closed"}
            animate={hideNextButton ? "closed" : "open"}
            exit={"closed"}
        >
            {t("next")}
        </Button>
    );
}
