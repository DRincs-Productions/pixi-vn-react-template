import { OfflineAllert } from "@/components/modals/error-allerts";
import GameSaveDialogue from "@/components/modals/GameSaveDialogue";
import SettingsDialogue from "@/components/modals/SettingsDialogue";
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
import { useQueryClient } from "@tanstack/react-query";
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
import { useEffect } from "react";

export const Route = createRootRouteWithContext<RouterContext>()({
    validateSearch: (search) => SearchParams.setMany(search),
    component: RootComponent,
    pendingComponent: LoadingScreen,
    loader: async () => {
        Game.onNavigate(async (to) => {
            redirect({ to });
        });
        await Promise.all([import("@/content"), import("@/labels")]);
        await Promise.all([initializeIndexedDB(), defineAssets(), useI18n()]);
        setupPixivnViteData();
    },
    errorComponent: (props) => (
        <div className="bg-background pointer-events-auto hover:text-foreground">
            <ErrorComponent {...props} />
        </div>
    ),
});

function RootSetup() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    Game.onNavigate((to) => navigate({ to }));
    useSaveHotkeys();

    useEffect(() => {
        let isMounted = true;
        const restoreRefreshSave = async () => {
            const isRefreshSaveExist = await loadRefreshSave();
            if (isMounted && isRefreshSaveExist) {
                await queryClient.invalidateQueries({
                    queryKey: [INTERFACE_DATA_USE_QUEY_KEY],
                });
            }
        };
        restoreRefreshSave();
        return () => {
            isMounted = false;
        };
    }, [queryClient]);

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
