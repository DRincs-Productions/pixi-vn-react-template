import { PendingComponent } from "@/components/loading";
import { SettingsDialogue } from "@/components/menus/settings";
import { OfflineAllert } from "@/components/modals/error-allerts";
import { RootProvider } from "@/components/providers/root-provider";
import { INTERFACE_DATA_USE_QUERY_KEY } from "@/constants";
import { useConfirmBackNavigation } from "@/lib/hooks/navigation-hooks";
import { useAutoSaveOnPageClose } from "@/lib/hooks/save-hooks";
import { useI18n } from "@/lib/i18n";
import { SearchParams } from "@/lib/stores/search-param-store";
import { defineAssets } from "@/lib/utils/assets-utility";
import { initializeIndexedDB } from "@/lib/utils/db-utility";
import { loadRefreshSave } from "@/lib/utils/save-utility";
import type { RouterContext } from "@/router";
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
        await setupPixivnViteData();
        if (location.pathname !== "/") {
            const isRefreshSaveExist = await loadRefreshSave();
            if (isRefreshSaveExist) {
                await context.queryClient.invalidateQueries({
                    queryKey: [INTERFACE_DATA_USE_QUERY_KEY],
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

            {import.meta.env.DEV && (
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
            )}
        </>
    );
}
