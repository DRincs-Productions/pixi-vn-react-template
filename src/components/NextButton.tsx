import { narration } from '@drincs/pixi-vn';
import { Button } from '@mui/joy';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from "motion/react";
import { useSnackbar } from 'notistack';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { hideInterfaceState } from '../atoms/hideInterfaceState';
import { nextStepLoadingState } from '../atoms/nextStepLoadingState';
import { skipEnabledState } from '../atoms/skipEnabledState';
import { INTERFACE_DATA_USE_QUEY_KEY, useQueryCanGoNext } from '../use_query/useQueryInterface';
import { useMyNavigate } from '../utilities/navigate-utility';

export default function NextButton() {
    const [skip, setSkip] = useRecoilState(skipEnabledState)
    const nextStepLoading = useRecoilValue(nextStepLoadingState)
    const { data: canGoNext = false } = useQueryCanGoNext()
    const hideNextButton = useRecoilValue(hideInterfaceState) || !canGoNext
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useMyNavigate();
    const { t } = useTranslation(["ui"]);
    const { t: tNarration } = useTranslation(["narration"]);
    const setNextStepLoading = useSetRecoilState(nextStepLoadingState);
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

    const onkeypress = useCallback((event: KeyboardEvent) => {
        if ((event.code == 'Enter' || event.code == 'Space')) {
            setSkip(true)
        }
    }, [])

    const onkeyup = useCallback((event: KeyboardEvent) => {
        if ((event.code == 'Enter' || event.code == 'Space')) {
            setSkip(false)
            nextOnClick()
        }
    }, [nextOnClick])

    useEffect(() => {
        window.addEventListener("keypress", onkeypress);
        window.addEventListener("keyup", onkeyup);

        return () => {
            window.removeEventListener("keypress", onkeypress);
            window.removeEventListener("keyup", onkeyup);
        };
    }, [onkeypress, onkeyup]);

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
                if (skip) {
                    setSkip(false)
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
