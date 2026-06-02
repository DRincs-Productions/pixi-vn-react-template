import { NarrationScreen } from "@/components/scrrens/narration";
import { NarrationClickOverlay } from "@/components/scrrens/narration/click-overlay";
import { useNarrationHotkeys } from "@/lib/hooks/hotkeys-hooks";
import { useSkipAutoDetector } from "@/lib/hooks/narration-hooks";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/game/narration")({
    component: NarrationElement,
});

function NarrationElement() {
    useSkipAutoDetector();
    useNarrationHotkeys();

    return (
        <>
            <NarrationClickOverlay />
            <NarrationScreen />
        </>
    );
}
