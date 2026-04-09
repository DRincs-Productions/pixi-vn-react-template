import { Game } from "@drincs/pixi-vn";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";

const queryClient = new QueryClient();
export const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    context: { queryClient },
});
Game.onNavigate((to) => router.navigate({ to }));

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}
