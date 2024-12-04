import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import LoadingScreen from "./screens/LoadingScreen";
import { defineAssets } from "./utilities/assets-utility";
import { initializeIndexedDB } from "./utilities/indexedDB-utility";

export default function App() {
    const Home = lazy(async () => {
        let promileAll = Promise.all([
            initializeIndexedDB(),
            defineAssets(),
        ])
        await promileAll
        return await import('./Home')
    })

    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Suspense
                fallback={<LoadingScreen />}
            >
                <Home />
            </Suspense>
        </ErrorBoundary>
    )
}
