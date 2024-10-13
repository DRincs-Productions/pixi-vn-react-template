import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import LoadingScreen from "./screens/LoadingScreen";

export default function App() {
    const Home = lazy(async () => import('./Home'))
    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Suspense
                fallback={<LoadingScreen />}
            >
                <Home />
            </Suspense>
        </ErrorBoundary >
    )
}
