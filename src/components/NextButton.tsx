import { StepLabelProps } from '@drincs/pixi-vn/dist/override';
import { Button } from '@mui/joy';
import { motion } from "framer-motion";
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue } from 'recoil';
import { hideInterfaceState } from '../atoms/hideInterfaceState';
import { nextStepLoadingState } from '../atoms/nextStepLoadingState';
import { skipEnabledState } from '../atoms/skipEnabledState';
import { useQueryCanGoNext } from '../use_query/useQueryInterface';
import { useMyNavigate } from '../utilities/navigate-utility';

export default function NextButton({ nextOnClick }: {
    nextOnClick: (props: StepLabelProps) => void,
}) {
    const [skip, setSkip] = useRecoilState(skipEnabledState)
    const nextStepLoading = useRecoilValue(nextStepLoadingState)
    const { data: canGoNext = false } = useQueryCanGoNext()
    const hideNextButton = useRecoilValue(hideInterfaceState) || !canGoNext
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useMyNavigate();
    const { t } = useTranslation(["ui"]);
    const { t: tNarration } = useTranslation(["narration"]);
    useEffect(() => {
        window.addEventListener("keypress", onkeypress);
        window.addEventListener("keyup", onkeyup);

        return () => {
            window.removeEventListener("keypress", onkeypress);
            window.removeEventListener("keyup", onkeyup);
        };
    }, []);

    function onkeypress(event: KeyboardEvent) {
        if ((event.code == 'Enter' || event.code == 'Space')) {
            setSkip(true)
        }
    }

    function onkeyup(event: KeyboardEvent) {
        if ((event.code == 'Enter' || event.code == 'Space')) {
            setSkip(false)
            nextOnClick({
                t: tNarration,
                navigate,
                notify: (message, variant) => enqueueSnackbar(message, { variant }),
            })
        }
    }

    return (
        <Button
            variant="solid"
            color="primary"
            size="sm"
            loading={nextStepLoading}
            sx={{
                position: "absolute",
                bottom: -10,
                right: 0,
                width: { xs: 70, sm: 100, md: 150 },
                border: 3,
                zIndex: 100,
            }}
            onClick={() => {
                if (skip) {
                    setSkip(false)
                }
                nextOnClick({
                    t: tNarration,
                    navigate,
                    notify: (message, variant) => enqueueSnackbar(message, { variant }),
                })
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
