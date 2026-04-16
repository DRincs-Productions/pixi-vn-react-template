import NarrationScreen from "@/components/menus/narration";
import VisibilityButton from "@/components/VisibilityButton";
import useNarrationFunctions from "@/hooks/useNarrationFunctions";
import useNarrationPointerHandlers from "@/hooks/useNarrationPointerHandlers";
import useSkipAutoDetector from "@/hooks/useSkipAutoDetector";
import HistoryScreen from "@/screens/HistoryScreen";
import { hasScrollableParent } from "@/utils/scroll-utils";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef } from "react";

export const Route = createFileRoute("/game/narration")({
    component: NarrationElement,
});

function NarrationElement() {
    const { goNext } = useNarrationFunctions();
    const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (e.button !== 0) return;
        if (hasScrollableParent(e.target)) return;
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
    }, []);

    const handlePointerUp = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            const start = pointerDownPos.current;
            pointerDownPos.current = null;
            if (!start) return;
            const dx = Math.abs(e.clientX - start.x);
            const dy = Math.abs(e.clientY - start.y);
            if (dx < 5 && dy < 5) {
                goNext();
            }
        },
        [goNext],
    );

    return (
        <div className="contents" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
            <HistoryScreen />
            <NarrationClickOverlay />
            <NarrationScreen />
            <NarrationDetectors />
            <VisibilityButton />
        </div>
    );
}

function NarrationClickOverlay() {
    const { handlePointerDown, handlePointerCancel, handlePointerUp } =
        useNarrationPointerHandlers();
    return (
        <div
            className="fixed inset-0 z-0 pointer-events-auto"
            onPointerDown={handlePointerDown}
            onPointerCancel={handlePointerCancel}
            onPointerUp={handlePointerUp}
        />
    );
}

function NarrationDetectors() {
    useSkipAutoDetector();
    return <></>;
}
