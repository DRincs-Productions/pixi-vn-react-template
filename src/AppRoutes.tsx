import { GameStepManager } from '@drincs/pixi-vn';
import { StepLabelProps } from '@drincs/pixi-vn/dist/override';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { canGoBackState } from './atoms/canGoBackState';
import { nextStepLoadingState } from './atoms/nextStepLoadingState';
import { reloadInterfaceDataEventState } from './atoms/reloadInterfaceDataEventState';
import DialogueDataEventInterceptor from './interceptors/DialogueDataEventInterceptor';
import SkipAutoInterceptor from './interceptors/SkipAutoInterceptor';
import Dialogue from './screens/Dialogue';
import History from './screens/History';
import MainMenu from './screens/MainMenu';
import QuickActions from './screens/QuickActions';
import QuickLoadAlert from './screens/QuickLoadAlert';

export default function AppRoutes() {
    const notifyReloadInterfaceDataEvent = useSetRecoilState(reloadInterfaceDataEventState);
    const setNextStepLoading = useSetRecoilState(nextStepLoadingState);
    const setCanGoBack = useSetRecoilState(canGoBackState);
    useEffect(() => {
        setTimeout(() => {
            setCanGoBack(GameStepManager.canGoBack)
        }, 10);
    }, []);
    async function nextOnClick(props: StepLabelProps): Promise<void> {
        setNextStepLoading(true);
        try {
            if (!GameStepManager.canGoNext) {
                setNextStepLoading(false);
                return;
            }
            await GameStepManager.goNext(props);
            notifyReloadInterfaceDataEvent((p) => p + 1);
            setNextStepLoading(false);
            setCanGoBack(GameStepManager.canGoBack)
            return;
        } catch (e) {
            setNextStepLoading(false);
            console.error(e);
            return;
        }
    }

    return (
        <Routes>
            <Route key={"main_menu"} path={"/"} element={<MainMenu />} />
            <Route key={"game"} path={"/game"}
                element={<>
                    <History />
                    <QuickLoadAlert />
                    <QuickActions />
                    <DialogueDataEventInterceptor />
                    <Dialogue
                        nextOnClick={nextOnClick}
                    />
                    <SkipAutoInterceptor
                        nextOnClick={nextOnClick}
                    />
                </>}
            />
        </Routes>
    )
}
