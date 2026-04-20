import App from "@/App";
import {
    BGM_CHANNEL_NAME,
    CANVAS_UI_LAYER_NAME,
    HTML_CANVAS_LAYER_NAME,
    HTML_UI_LAYER_NAME,
    SFX_CHANNEL_NAME,
} from "@/constans";
import "@/styles.css";
import { Assets, canvas, Container, drawCanvasErrorHandler, Game, sound } from "@drincs/pixi-vn";
import { createRoot } from "react-dom/client";

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
    resizeMode: "contain",
}).then(() => {
    // Pixi.JS UI Layer
    canvas.addLayer(CANVAS_UI_LAYER_NAME, new Container());

    // Sound setup
    sound.addChannel(BGM_CHANNEL_NAME, { background: true });
    sound.addChannel(SFX_CHANNEL_NAME);
    sound.defaultChannelAlias = SFX_CHANNEL_NAME;

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
    reactRoot.render(<App />);
});

Game.onEnd(async ({ navigate }) => {
    Game.clear();
    navigate({ to: "/" });
});

Game.addOnError(drawCanvasErrorHandler());
Game.addOnError((error, { toast, uiTransition }) => {
    toast && uiTransition && toast.error(uiTransition("allert_error_occurred"));
    console.error(`Error occurred`, error);
});

Game.onLoadingLabel((_stepId, { id }) => Assets.backgroundLoadBundle(id));
