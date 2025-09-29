import { setupPixivnViteData } from "@drincs/pixi-vn/vite-listener";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useI18n } from "./i18n";
import LoadingScreen from "./screens/LoadingScreen";
import { defineAssets } from "./utils/assets-utility";
import { initializeIndexedDB } from "./utils/indexedDB-utility";

const Home = lazy(async () => {
    await Promise.all([import("./values"), import("./labels")]);
    await Promise.all([initializeIndexedDB(), defineAssets(), useI18n()]);
    setupPixivnViteData();
    return import("./Home");
});

function ErrorFallback({ error }: { error: Error }) {
    return (
        <div
            role='alert'
            style={{
                pointerEvents: "auto",
                backgroundColor: "black",
            }}
        >
            <h2
                style={{
                    color: "red",
                    fontSize: "2rem",
                    textAlign: "center",
                    marginTop: "1rem",
                }}
            >
                Something went wrong
            </h2>
            <p
                style={{
                    color: "white",
                    fontSize: "1.5rem",
                    textAlign: "center",
                    marginTop: "1rem",
                }}
            >
                {error.message}
            </p>
        </div>
    );
}

export default function App() {
    const queryClient = useMemo(() => new QueryClient(), []);
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <QueryClientProvider client={queryClient}>
                <Suspense fallback={<LoadingScreen />}>
                    <Home />
                </Suspense>
            </QueryClientProvider>
        </ErrorBoundary>
    );
}
