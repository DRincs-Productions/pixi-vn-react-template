import { Game } from "@drincs/pixi-vn";
import { setupPixivnViteData } from "@drincs/pixi-vn/vite-listener";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { createRootRoute, ErrorComponent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import useClosePageDetector from "@/hooks/useClosePageDetector";
import useKeyboardDetector from "@/hooks/useKeyboardDetector";
import useEventListener from "@/hooks/useKeyDetector";
import useMyNavigate from "@/hooks/useMyNavigate";
import { useI18n } from "@/i18n";
import RootProvider from "@/providers/RootProvider";
import GameSaveScreen from "@/screens/GameSaveScreen";
import SaveLoadAlert from "@/screens/modals/SaveLoadAlert";
import OfflineScreen from "@/screens/OfflineScreen";
import Settings from "@/screens/Settings";
import { defineAssets } from "@/utils/assets-utility";
import { initializeIndexedDB } from "@/utils/indexedDB-utility";

export const Route = createRootRoute({
    component: RootComponent,
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
    notFoundComponent: () => <NotFoundRedirect />,
});

function NotFoundRedirect() {
    const navigate = useMyNavigate();
    useEffect(() => {
        navigate("/");
    }, [navigate]);
    return null;
}

function RootComponent() {
    const navigate = useMyNavigate();
    useKeyboardDetector();
    useClosePageDetector();
    // Prevent the user from going back to the previous page
    useEventListener({
        type: "popstate",
        listener: () => {
            window.history.forward();
        },
    });

    useEffect(() => {
        Game.onNavigate(navigate);
    }, [navigate]);

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
