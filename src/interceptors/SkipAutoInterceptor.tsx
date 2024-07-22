import { StepLabelProps } from '@drincs/pixi-vn/dist/override';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { autoEnabledState } from '../atoms/autoEnabledState';
import { skipEnabledState } from '../atoms/skipEnabledState';
import { typewriterIsAnimatedState } from '../atoms/typewriterIsAnimatedState';
import { useMyNavigate } from '../utility/useMyNavigate';

export default function SkipAutoInterceptor({ nextOnClick }: {
    nextOnClick: (props: StepLabelProps) => Promise<void>,
}) {
    const navigate = useMyNavigate();
    const { t } = useTranslation(["translation"]);
    const skipEnabled = useRecoilValue(skipEnabledState)
    const autoEnabled = useRecoilValue(autoEnabledState)
    const typewriterIsAnimated = useRecoilValue(typewriterIsAnimatedState)
    const [recheckSkip, setRecheckSkip] = useState<number>(0)
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        // Debouncing
        let timeout = setTimeout(() => {
            if (skipEnabled) {
                nextOnClick({
                    t,
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
        if (autoEnabled && !typewriterIsAnimated) {
            let autoForwardSecond = localStorage.getItem('auto_forward_second')
            if (autoForwardSecond) {
                let millisecond = parseInt(autoForwardSecond) * 1000
                // Debouncing
                let timeout = setTimeout(() => {
                    if (autoEnabled && !skipEnabled) {
                        nextOnClick({
                            t,
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
    }, [autoEnabled, typewriterIsAnimated, skipEnabled])

    return null
}
