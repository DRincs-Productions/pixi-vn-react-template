import { Assets, canvas, Container, Game } from "@drincs/pixi-vn";
import { setupInkHmrListener } from "@drincs/pixi-vn-ink/vite-listener";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CANVAS_UI_LAYER_NAME, HTML_CANVAS_LAYER_NAME, HTML_UI_LAYER_NAME } from "./constans";
import "./index.css";

// Register service worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js").catch(console.error);
    });
}

// Canvas setup with PIXI
const body = document.body;
if (!body) {
    throw new Error("body element not found");
}

Game.init(body, {
    id: HTML_CANVAS_LAYER_NAME,
    height: 1080,
    width: 1920,
    backgroundColor: "#303030",
}).then(() => {
    // Pixi.JS UI Layer
    canvas.addLayer(CANVAS_UI_LAYER_NAME, new Container());

    // React setup with ReactDOM
    const root = document.getElementById("root");
    if (!root) {
        throw new Error("root element not found");
    }

    const htmlLayout = canvas.addHtmlLayer(HTML_UI_LAYER_NAME, root);
    if (!htmlLayout) {
        throw new Error("htmlLayout not found");
    }
    const reactRoot = createRoot(htmlLayout);
    const queryClient = new QueryClient();

    reactRoot.render(
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>,
    );
});

Game.onEnd(async ({ navigate }) => {
    Game.clear();
    navigate("/");
});

Game.onError((type, error, { notify, uiTransition }) => {
    notify(uiTransition("allert_error_occurred"), { variant: "error" });
    console.error(`Error occurred: ${type}`, error);
});

Game.onLoadingLabel((_stepId, { id }) => Assets.backgroundLoadBundle(id));

setupInkHmrListener();
