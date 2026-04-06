import { RouterProvider } from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import LoadingScreen from "./screens/LoadingScreen";
import { router } from "./router";

export default function App() {
    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Suspense
                fallback={<LoadingScreen />}
            >
                <RouterProvider router={router} />
            </Suspense>
        </ErrorBoundary >
    )
}
