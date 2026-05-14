import { PendingComponent } from "@/components/loading";
import { routeTree } from "@/routeTree.gen";
import type { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";

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
        defaultPendingComponent: PendingComponent,
    });

    return router;
}

declare module "@tanstack/react-router" {
    interface Register {
        router: ReturnType<typeof getRouter>;
    }
}
