import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useI18n } from "./i18n";
import LoadingScreen from "./screens/LoadingScreen";
import { defineAssets } from "./utils/assets-utility";
import { initializeIndexedDB } from "./utils/indexedDB-utility";

const Home = lazy(async () => {
    await Promise.all([import("./values"), import("./labels"), initializeIndexedDB(), defineAssets(), useI18n()]);
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
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<LoadingScreen />}>
                <Home />
            </Suspense>
        </ErrorBoundary>
    );
}
