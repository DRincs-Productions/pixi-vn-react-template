import { NarrationScreen } from "@/components/menus/narration";
import { NarrationClickOverlay } from "@/components/menus/narration/click-overlay";
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
