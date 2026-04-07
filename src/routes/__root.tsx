import { setupPixivnViteData } from "@drincs/pixi-vn/vite-listener";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { createRootRoute, ErrorComponent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import useClosePageDetector from "@/hooks/useClosePageDetector";
import useConfirmBackNavigation from "@/hooks/useConfirmBackNavigation";
import useKeyboardDetector from "@/hooks/useKeyboardDetector";
import { useI18n } from "@/i18n";
import RootProvider from "@/providers/RootProvider";
import GameSaveScreen from "@/screens/GameSaveScreen";
import LoadingScreen from "@/screens/LoadingScreen";
import SaveLoadAlert from "@/screens/modals/SaveLoadAlert";
import OfflineScreen from "@/screens/OfflineScreen";
import Settings from "@/screens/Settings";
import { defineAssets } from "@/utils/assets-utility";
import { initializeIndexedDB } from "@/utils/indexedDB-utility";

export const Route = createRootRoute({
    component: RootComponent,
    pendingComponent: LoadingScreen,
    errorComponent: (props) => (
        <div style={{ pointerEvents: "auto", backgroundColor: "rgba(145, 145, 145, 0.5)" }}>
            <ErrorComponent {...props} />
        </div>
    ),
    loader: async () => {
        await Promise.all([import("@/values"), import("@/labels")]);
        await Promise.all([initializeIndexedDB(), defineAssets(), useI18n()]);
        setupPixivnViteData();
    },
});

function RootComponent() {
    useKeyboardDetector();
    useClosePageDetector();
    useConfirmBackNavigation();

    return (
        <>
            <RootProvider>
                <Settings />
                <GameSaveScreen />
                <SaveLoadAlert />
                <OfflineScreen />
                <Outlet />
            </RootProvider>

            <TanStackDevtools
                config={{
                    position: "bottom-right",
                }}
                plugins={[
                    {
                        name: "TanStack Router",
                        render: <TanStackRouterDevtoolsPanel />,
                    },
                    {
                        name: "Tanstack Query",
                        render: <ReactQueryDevtoolsPanel />,
                    },
                ]}
            />
        </>
    );
}
