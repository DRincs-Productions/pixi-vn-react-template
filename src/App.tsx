import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";
import LoadingScreen from "./screens/LoadingScreen";
import { initializeIndexedDB } from "./utilities/indexedDB-utility";
import { importAllInkLabels } from "./utilities/ink-utility";

export default function App() {
    const Home = lazy(async () => {
        let promileAll = Promise.all([
            initializeIndexedDB(),
            importAllInkLabels(),
        ])
        await promileAll
        return import('./Home')
    })
    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <BrowserRouter>
                <Suspense
                    fallback={<LoadingScreen />}
                >
                    <Home />
                </Suspense>
            </BrowserRouter >
        </ErrorBoundary >
    )
}
