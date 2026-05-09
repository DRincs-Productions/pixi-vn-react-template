import { useNarrationPointerHandlers } from "@/lib/hooks/narration-hooks";

export function NarrationClickOverlay() {
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
