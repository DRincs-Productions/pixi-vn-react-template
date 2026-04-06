import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Box } from '@mui/joy'
import { SnackbarProvider } from 'notistack'
import { RecoilRoot } from 'recoil'
import { useI18n } from './i18n'
import MyThemeProvider from './providers/ThemeProvider'
import EventInterceptor from './interceptors/EventInterceptor'
import GameSaveScreen from './screens/GameSaveScreen'
import LoadingScreen from './screens/LoadingScreen'
import MainMenu from './screens/MainMenu'
import SaveLoadAlert from './screens/modals/SaveLoadAlert'
import Settings from './screens/Settings'
import NarrationLayout from './AppRoutes'

const queryClient = new QueryClient()

function RootLayout() {
    useI18n()
    return (
        <RecoilRoot>
            <QueryClientProvider client={queryClient}>
                <MyThemeProvider>
                    <SnackbarProvider
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <Outlet />
                        <Settings />
                        <GameSaveScreen />
                        <SaveLoadAlert />
                        <EventInterceptor />
                        <Box
                            sx={{
                                pointerEvents: "auto",
                            }}
                        >
                            <ReactQueryDevtools initialIsOpen={false} />
                        </Box>
                    </SnackbarProvider>
                </MyThemeProvider>
            </QueryClientProvider>
        </RecoilRoot>
    )
}

const rootRoute = createRootRoute({
    component: RootLayout,
    notFoundComponent: MainMenu,
})

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: MainMenu,
})

const loadingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/loading',
    component: LoadingScreen,
})

const narrationRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/narration',
    component: NarrationLayout,
})

const routeTree = rootRoute.addChildren([indexRoute, loadingRoute, narrationRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}
