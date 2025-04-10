import { canvas, Container, Game, narration } from "@drincs/pixi-vn";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CANVAS_UI_LAYER_NAME } from "./constans";
import "./index.css";
import "./labels";
import "./values/characters";

const body = document.body;
if (!body) {
    throw new Error("body element not found");
}

Game.init(body, {
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

    canvas.initializeHTMLLayout(root);
    if (!canvas.htmlLayout) {
        throw new Error("htmlLayout not found");
    }
    const reactRoot = createRoot(canvas.htmlLayout);

    reactRoot.render(<App />);
});

narration.onGameEnd = async ({ navigate }) => {
    Game.clear();
    navigate("/");
};

narration.onStepError = async (_error, { notify, t }) => {
    notify(t("allert_error_occurred"), { variant: "error" });
};
