import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";

const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

export default function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}
