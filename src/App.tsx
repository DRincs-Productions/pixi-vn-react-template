import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useI18n } from "./i18n";
import LoadingScreen from "./screens/LoadingScreen";
import { defineAssets } from "./utils/assets-utility";
import { initializeIndexedDB } from "./utils/indexedDB-utility";
import { importAllInkLabels } from "./utils/ink-utility";

export default function App() {
    const Home = lazy(async () => {
        let promileAll = Promise.all([initializeIndexedDB(), defineAssets(), useI18n(), importAllInkLabels()]);
        await promileAll;
        return await import("./Home");
    });

    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Suspense fallback={<LoadingScreen />}>
                <Home />
            </Suspense>
        </ErrorBoundary>
    );
}
