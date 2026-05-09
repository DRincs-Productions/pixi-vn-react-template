import { PendingComponent } from "@/components/loading";
import { SettingsDialogue } from "@/components/menus/settings";
import { OfflineAllert } from "@/components/modals/error-allerts";
import { RootProvider } from "@/components/providers/root-provider";
import { useConfirmBackNavigation } from "@/hooks/navigation-hooks";
import { useAutoSaveOnPageClose } from "@/hooks/save-hooks";
import { INTERFACE_DATA_USE_QUEY_KEY } from "@/hooks/useQueryInterface";
import { useI18n } from "@/lib/i18n";
import { SearchParams } from "@/lib/stores/search-param-store";
import type { RouterContext } from "@/router";
import { defineAssets } from "@/utils/assets-utility";
import { initializeIndexedDB } from "@/utils/indexedDB-utility";
import { loadRefreshSave } from "@/utils/save-utility";
import { setupPixivnViteData } from "@drincs/pixi-vn/vite-listener";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { hotkeysDevtoolsPlugin } from "@tanstack/react-hotkeys-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, ErrorComponent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
export const Route = createRootRouteWithContext<RouterContext>()({
    validateSearch: (search) => SearchParams.setMany(search),
    component: RootComponent,
    pendingComponent: PendingComponent,
    loader: async ({ context, location }) => {
        // Game.onNavigate(async (to) => redirect({ to }));
        await Promise.all([import("@/content"), initializeIndexedDB(), defineAssets(), useI18n()]);
        setupPixivnViteData();
        if (location.pathname !== "/") {
            const isRefreshSaveExist = await loadRefreshSave();
            if (isRefreshSaveExist) {
                await context.queryClient.invalidateQueries({
                    queryKey: [INTERFACE_DATA_USE_QUEY_KEY],
                });
            }
        }
    },
    errorComponent: (props) => (
        <div className="bg-background pointer-events-auto hover:text-foreground">
            <ErrorComponent {...props} />
        </div>
    ),
});

function RootComponent() {
    useAutoSaveOnPageClose();
    useConfirmBackNavigation();

    return (
        <>
            <RootProvider>
                <SettingsDialogue />
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
