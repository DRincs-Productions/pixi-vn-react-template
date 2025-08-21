import { canvas, Layer } from "@drincs/pixi-vn";
import { Container } from "@drincs/pixi-vn/pixi.js";
import { useEffect, useRef } from "react";
import { CANVAS_MINIGAME_LAYER_NAME } from "../constans";

export default function useMinigame(
    game: (layer: Layer) => void,
    props?: {
        onStart?: () => Promise<void>;
        onExit?: (layer: Layer) => void;
    }
) {
    const loading = useRef(false);

    // Keep latest callbacks in refs to avoid effect restarts
    const startRef = useRef<() => Promise<void>>(props?.onStart ?? (async () => {}));
    const exitRef = useRef<(layer: Layer) => void>(props?.onExit);

    // Update refs when props change, without changing effect identity
    useEffect(() => {
        startRef.current = props?.onStart ?? (async () => {});
    }, [props?.onStart]);

    useEffect(() => {
        exitRef.current = props?.onExit;
    }, [props?.onExit]);

    useEffect(() => {
        // Create the layer and start the game once
        loading.current = true;
        const layer = canvas.addLayer(CANVAS_MINIGAME_LAYER_NAME, new Container());
        if (!layer) {
            console.error("Failed to create UI layer for minigame");
            return;
        }

        let cancelled = false;

        startRef.current().then(() => {
            if (cancelled) return;
            loading.current = false;
            game(layer);
        });

        return () => {
            cancelled = true;
            canvas.removeLayer(CANVAS_MINIGAME_LAYER_NAME);
            if (exitRef.current) {
                exitRef.current(layer);
            }
        };
    }, [game]);

    return { loading };
}
