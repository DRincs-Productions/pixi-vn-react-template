import { useNarrationPointerHandlers } from "@/lib/hooks/narration-hooks";

export function NarrationClickOverlay() {
    const { handlePointerDown, handlePointerCancel, handlePointerMove, handlePointerUp } =
        useNarrationPointerHandlers();
    return (
        <div
            className="fixed inset-0 z-0 pointer-events-auto"
            onPointerDown={handlePointerDown}
            onPointerCancel={handlePointerCancel}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        />
    );
}
