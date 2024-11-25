import { Route, Routes } from 'react-router-dom';
import NextButton from './components/NextButton';
import SkipAutoInterceptor from './interceptors/SkipAutoInterceptor';
import HistoryScreen from './screens/HistoryScreen';
import LoadingScreen from './screens/LoadingScreen';
import MainMenu from './screens/MainMenu';
import TextInput from './screens/modals/TextInput';
import NarrationScreen from './screens/NarrationScreen';
import QuickTools from './screens/QuickTools';

export default function AppRoutes() {
    return (
        <Routes>
            <Route key={"main_menu"} path={"/"} element={<MainMenu />} />
            <Route key={"loading"} path={"/loading"} element={<LoadingScreen />} />
            <Route key={"narration"} path={"/narration"}
                element={<>
                    <HistoryScreen />
                    <QuickTools />
                    <NarrationScreen />
                    <SkipAutoInterceptor />
                    <TextInput />
                    <NextButton />
                </>}
            />
            <Route path="*" element={<MainMenu />} />
        </Routes>
    )
}
