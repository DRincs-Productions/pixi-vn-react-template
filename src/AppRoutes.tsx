import { GameStepManager } from '@drincs/pixi-vn';
import { StepLabelProps } from '@drincs/pixi-vn/dist/override';
import { Route, Routes } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { nextStepLoadingState } from './atoms/nextStepLoadingState';
import { reloadInterfaceDataEventState } from './atoms/reloadInterfaceDataEventState';
import DialogueDataEventInterceptor from './interceptors/DialogueDataEventInterceptor';
import SkipAutoInterceptor from './interceptors/SkipAutoInterceptor';
import Dialogue from './screens/Dialogue';
import History from './screens/History';
import LoadingPage from './screens/LoadingPage';
import MainMenu from './screens/MainMenu';
import QuickActions from './screens/QuickActions';
import QuickLoadAlert from './screens/QuickLoadAlert';

export default function AppRoutes() {
    const notifyReloadInterfaceDataEvent = useSetRecoilState(reloadInterfaceDataEventState);
    const setNextStepLoading = useSetRecoilState(nextStepLoadingState);
    async function nextOnClick(props: StepLabelProps): Promise<void> {
        setNextStepLoading(true);
        try {
            if (!GameStepManager.canGoNext) {
                setNextStepLoading(false);
                return;
            }
            GameStepManager.goNext(props)
                .then(() => {
                    notifyReloadInterfaceDataEvent((p) => p + 1);
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
        <Routes>
            <Route key={"main_menu"} path={"/"} element={<MainMenu />} />
            <Route key={"main_menu"} path={"/loading"} element={<LoadingPage />} />
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
            <Route path="*" element={<MainMenu />} />
        </Routes>
    )
}
