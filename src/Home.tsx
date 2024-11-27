import { Box } from '@mui/joy';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Routes from './AppRoutes';
import Imports from './Imports';
import GoBackEventInterceptor from './interceptors/GoBackEventInterceptor';
import OnKeyEventInterceptor from './interceptors/OnKeyEventInterceptor';
import RefreshSaveEventInterceptor from './interceptors/RefreshEventInterceptor';
import GameSaveScreen from './screens/GameSaveScreen';
import SaveLoadAlert from './screens/modals/SaveLoadAlert';
import Settings from './screens/Settings';

export default function Home() {
    return (
        <Imports>
            <Routes />
            <Settings />
            <GameSaveScreen />
            <SaveLoadAlert />
            <OnKeyEventInterceptor />
            <GoBackEventInterceptor />
            <RefreshSaveEventInterceptor />
            <Box
                sx={{
                    pointerEvents: "auto",
                }}
            >
                <ReactQueryDevtools initialIsOpen={false} />
            </Box>
        </Imports>
    )
}
