import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Canvas setup with PIXI
const body = document.body;
if (!body) {
    throw new Error("body element not found");
}

// React setup with ReactDOM
const root = document.getElementById("root");
if (!root) {
    throw new Error("root element not found");
}

const reactRoot = createRoot(root);

reactRoot.render(<App />);
