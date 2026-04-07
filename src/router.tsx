import type { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter, ErrorComponent } from "@tanstack/react-router";
import LoadingScreen from "@/screens/LoadingScreen";
import { routeTree } from "./routeTree.gen";

export interface RouterContext {
    queryClient: QueryClient;
}

export function getRouter(context: RouterContext) {
    const router = createTanStackRouter({
        routeTree,
        context,
        scrollRestoration: true,
        defaultPreload: "intent",
        defaultPreloadStaleTime: 0,
        defaultPendingComponent: LoadingScreen,
        defaultErrorComponent: (props) => (
            <div style={{ pointerEvents: "auto", backgroundColor: "rgba(145, 145, 145, 0.5)" }}>
                <ErrorComponent {...props} />
            </div>
        ),
    });

    return router;
}

declare module "@tanstack/react-router" {
    interface Register {
        router: ReturnType<typeof getRouter>;
    }
}
