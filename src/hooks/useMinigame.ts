import { canvas, Layer, PIXI } from "@drincs/pixi-vn";
import { useEffect, useRef } from "react";
import { CANVAS_MINIGAME_LAYER_NAME } from "../constans";

export default function useMinigame(
    game: (layer: Layer) => void,
    props?: {
        onStart?: () => Promise<void>;
        onExit?: (layer: Layer) => void;
    }
) {
    const { onStart = () => Promise.resolve(), onExit } = props || {};
    const loading = useRef(false);

    useEffect(() => {
        loading.current = true;
        const layer = canvas.addLayer(CANVAS_MINIGAME_LAYER_NAME, new PIXI.Container());
        if (!layer) {
            console.error("Failed to create UI layer for minigame");
            return;
        }
        onStart().then(() => {
            loading.current = false;
            game(layer);
        });

        return () => {
            canvas.removeLayer(CANVAS_MINIGAME_LAYER_NAME);
            if (onExit) {
                onExit(layer);
            }
        };
    }, [game, onStart, onExit]);

    return {
        loading,
    };
}
