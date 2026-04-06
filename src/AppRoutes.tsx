import { narration } from '@drincs/pixi-vn';
import { StepLabelProps } from '@drincs/pixi-vn/dist/override';
import { useQueryClient } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import { nextStepLoadingState } from './atoms/nextStepLoadingState';
import SkipAutoInterceptor from './interceptors/SkipAutoInterceptor';
import HistoryScreen from './screens/HistoryScreen';
import TextInput from './screens/modals/TextInput';
import NarrationScreen from './screens/NarrationScreen';
import QuickTools from './screens/QuickTools';
import { INTERFACE_DATA_USE_QUEY_KEY } from './use_query/useQueryInterface';

export default function NarrationLayout() {
    const setNextStepLoading = useSetRecoilState(nextStepLoadingState);
    const queryClient = useQueryClient()

    async function nextOnClick(props: StepLabelProps): Promise<void> {
        setNextStepLoading(true);
        try {
            if (!narration.canGoNext) {
                setNextStepLoading(false);
                return;
            }
            narration.goNext(props)
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
    }

    return (
        <>
            <HistoryScreen />
            <QuickTools />
            <NarrationScreen
                nextOnClick={nextOnClick}
            />
            <SkipAutoInterceptor
                nextOnClick={nextOnClick}
            />
            <TextInput />
        </>
    )
}
