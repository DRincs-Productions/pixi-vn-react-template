import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";
import HomeLazy from "./HomeLazy";
import LoadingScreen from "./screens/LoadingScreen";

export default function App() {
    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <BrowserRouter>
                <Suspense
                    fallback={<LoadingScreen />}
                >
                    <HomeLazy />
                </Suspense>
            </BrowserRouter >
        </ErrorBoundary >
    )
}
