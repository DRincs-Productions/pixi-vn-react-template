import { lazy, Suspense } from "react";
import LoadingScreen from "./screens/LoadingScreen";
import { initializeIndexedDB } from "./utilities/indexedDB-utility";

export default function HomeLazy() {
    const Home = lazy(async () => {
        let promileAll = Promise.all([
            initializeIndexedDB(),
        ])
        await promileAll
        return import('./Home')
    })
    return (
        <Suspense
            fallback={<LoadingScreen />}
        >
            <Home />
        </Suspense>
    )
}
