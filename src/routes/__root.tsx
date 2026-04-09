import { setupPixivnViteData } from "@drincs/pixi-vn/vite-listener";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { hotkeysDevtoolsPlugin } from "@tanstack/react-hotkeys-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import useClosePageDetector from "@/hooks/useClosePageDetector";
import useConfirmBackNavigation from "@/hooks/useConfirmBackNavigation";
import { INTERFACE_DATA_USE_QUEY_KEY } from "@/hooks/useQueryInterface";
import useSaveHotkeys from "@/hooks/useSaveHotkeys";
import { useI18n } from "@/i18n";
import RootProvider from "@/providers/RootProvider";
import type { RouterContext } from "@/router";
import GameSaveScreen from "@/screens/GameSaveScreen";
import LoadingScreen from "@/screens/LoadingScreen";
import SaveLoadAlert from "@/screens/modals/SaveLoadAlert";
import OfflineScreen from "@/screens/OfflineScreen";
import Settings from "@/screens/Settings";
import { defineAssets } from "@/utils/assets-utility";
import { initializeIndexedDB } from "@/utils/indexedDB-utility";
import { loadRefreshSave } from "@/utils/save-utility";

type Search = {
    /**
     * Whether the settings page is open.
     */
    settings?: boolean;
};

export const Route = createRootRouteWithContext<RouterContext>()({
    validateSearch: (search: Search): Search => search,
    component: RootComponent,
    pendingComponent: LoadingScreen,
    loader: async ({ context }) => {
        await Promise.all([import("@/values"), import("@/labels")]);
        await Promise.all([initializeIndexedDB(), defineAssets(), useI18n()]);
        setupPixivnViteData();
        const isRefreshSaveExist = await loadRefreshSave((to) => redirect({ to }));
        if (isRefreshSaveExist) {
            await context.queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] });
        }
    },
});

function RootComponent() {
    useSaveHotkeys();
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
                        name: "UI screens",
                        render: <TanStackRouterDevtoolsPanel />,
                    },
                    { ...hotkeysDevtoolsPlugin(), name: "Hotkeys" },
                    {
                        name: "UI cache",
                        render: <ReactQueryDevtoolsPanel />,
                    },
                ]}
            />
        </>
    );
}
