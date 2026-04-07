import { setupPixivnViteData } from "@drincs/pixi-vn/vite-listener";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, ErrorComponent, Outlet, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import useClosePageDetector from "@/hooks/useClosePageDetector";
import useConfirmBackNavigation from "@/hooks/useConfirmBackNavigation";
import useKeyboardDetector from "@/hooks/useKeyboardDetector";
import { INTERFACE_DATA_USE_QUEY_KEY } from "@/hooks/useQueryInterface";
import { useI18n } from "@/i18n";
import type { RouterContext } from "@/router";
import RootProvider from "@/providers/RootProvider";
import GameSaveScreen from "@/screens/GameSaveScreen";
import LoadingScreen from "@/screens/LoadingScreen";
import SaveLoadAlert from "@/screens/modals/SaveLoadAlert";
import OfflineScreen from "@/screens/OfflineScreen";
import Settings from "@/screens/Settings";
import { defineAssets } from "@/utils/assets-utility";
import { initializeIndexedDB } from "@/utils/indexedDB-utility";
import { loadRefreshSaveForLoader } from "@/utils/save-utility";
import type { FileRouteTypes } from "@/routeTree.gen";

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootComponent,
    pendingComponent: LoadingScreen,
    pendingMs: 300,
    pendingMinMs: 500,
    errorComponent: (props) => (
        <div style={{ pointerEvents: "auto", backgroundColor: "rgba(145, 145, 145, 0.5)" }}>
            <ErrorComponent {...props} />
        </div>
    ),
    loader: async ({ context }) => {
        await Promise.all([import("@/values"), import("@/labels")]);
        await Promise.all([initializeIndexedDB(), defineAssets(), useI18n()]);
        setupPixivnViteData();
        const targetRoute = await loadRefreshSaveForLoader();
        await context.queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] });
        const validRoutes: FileRouteTypes["fullPaths"][] = ["/", "/loading", "/narration"];
        const to = validRoutes.includes(targetRoute as FileRouteTypes["fullPaths"])
            ? (targetRoute as FileRouteTypes["fullPaths"])
            : "/";
        if (targetRoute !== null) {
            throw redirect({ to });
        }
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
