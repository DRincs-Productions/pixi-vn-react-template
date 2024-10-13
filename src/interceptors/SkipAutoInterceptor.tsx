import { StepLabelProps } from '@drincs/pixi-vn/dist/override';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { autoInfoState } from '../atoms/autoInfoState';
import { skipEnabledState } from '../atoms/skipEnabledState';
import { typewriterIsAnimatedState } from '../atoms/typewriterIsAnimatedState';
import { useMyNavigate } from '../utilities/navigate-utility';

export default function SkipAutoInterceptor({ nextOnClick }: {
    nextOnClick: (props: StepLabelProps) => Promise<void>,
}) {
    const navigate = useMyNavigate();
    const { t: tNarration } = useTranslation(["narration"]);
    const skipEnabled = useRecoilValue(skipEnabledState)
    const autoInfo = useRecoilValue(autoInfoState)
    const typewriterIsAnimated = useRecoilValue(typewriterIsAnimatedState)
    const [recheckSkip, setRecheckSkip] = useState<number>(0)
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        // Debouncing
        let timeout = setTimeout(() => {
            if (skipEnabled) {
                nextOnClick({
                    t: tNarration,
                    navigate,
                    notify: (message, variant) => enqueueSnackbar(message, { variant }),
                }).then(() => {
                    setRecheckSkip((p) => p + 1)
                })
            }
        }, 400);

        return () => {
            clearTimeout(timeout)
        }
    }, [skipEnabled, recheckSkip])

    useEffect(() => {
        if (skipEnabled) {
            return
        }
        if (autoInfo.enabled && !typewriterIsAnimated) {
            if (autoInfo.time) {
                let millisecond = autoInfo.time * 1000
                // Debouncing
                let timeout = setTimeout(() => {
                    if (autoInfo.enabled && !skipEnabled) {
                        nextOnClick({
                            t: tNarration,
                            navigate,
                            notify: (message, variant) => enqueueSnackbar(message, { variant }),
                        })
                    }
                }, millisecond);

                return () => {
                    clearTimeout(timeout)
                }
            }
        }
    }, [autoInfo, typewriterIsAnimated, skipEnabled])

    return null
}
