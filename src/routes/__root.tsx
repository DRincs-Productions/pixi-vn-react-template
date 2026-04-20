import { OfflineAllert } from "@/components/modals/error-allerts";
import GameSaveDialogue from "@/components/modals/GameSaveDialogue";
import SettingsDialogue from "@/components/modals/SettingsDialogue";
import HotkeysMenu from "@/components/menus/hotkeys-menu";
import RootProvider from "@/components/providers/RootProvider";
import useClosePageDetector from "@/hooks/useClosePageDetector";
import useConfirmBackNavigation from "@/hooks/useConfirmBackNavigation";
import { INTERFACE_DATA_USE_QUEY_KEY } from "@/hooks/useQueryInterface";
import useSaveHotkeys from "@/hooks/useSaveHotkeys";
import { useI18n } from "@/lib/i18n";
import { SearchParams } from "@/lib/stores/search-param-store";
import type { RouterContext } from "@/router";
import LoadingScreen from "@/screens/LoadingScreen";
import { defineAssets } from "@/utils/assets-utility";
import { initializeIndexedDB } from "@/utils/indexedDB-utility";
import { loadRefreshSave } from "@/utils/save-utility";
import { Game } from "@drincs/pixi-vn";
import { setupPixivnViteData } from "@drincs/pixi-vn/vite-listener";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { hotkeysDevtoolsPlugin } from "@tanstack/react-hotkeys-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
    createRootRouteWithContext,
    ErrorComponent,
    Outlet,
    redirect,
    useNavigate,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

export const Route = createRootRouteWithContext<RouterContext>()({
    validateSearch: (search) => SearchParams.setMany(search),
    component: RootComponent,
    pendingComponent: LoadingScreen,
    loader: async ({ context }) => {
        Game.onNavigate(async (to) => {
            redirect({ to });
        });
        await Promise.all([import("@/content"), import("@/labels")]);
        await Promise.all([initializeIndexedDB(), defineAssets(), useI18n()]);
        setupPixivnViteData();
        const isRefreshSaveExist = await loadRefreshSave();
        if (isRefreshSaveExist) {
            await context.queryClient.invalidateQueries({
                queryKey: [INTERFACE_DATA_USE_QUEY_KEY],
            });
        }
    },
    errorComponent: (props) => (
        <div className="bg-background pointer-events-auto hover:text-foreground">
            <ErrorComponent {...props} />
        </div>
    ),
});

function RootSetup() {
    const navigate = useNavigate();
    Game.onNavigate((to) => navigate({ to }));
    useSaveHotkeys();
    return null;
}

function RootComponent() {
    useClosePageDetector();
    useConfirmBackNavigation();

    return (
        <>
            <RootProvider>
                <RootSetup />
                <SettingsDialogue />
                <GameSaveDialogue />
                <HotkeysMenu />
                <OfflineAllert />
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
