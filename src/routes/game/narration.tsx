import { createFileRoute } from "@tanstack/react-router";
import NarrationScreen from "@/components/menus/narration";
import { QuickTools } from "@/components/menus/quick-tools";
import VisibilityButton from "@/components/VisibilityButton";
import useNarrationPointerHandlers from "@/hooks/useNarrationPointerHandlers";
import useSkipAutoDetector from "@/hooks/useSkipAutoDetector";
import HistoryScreen from "@/screens/HistoryScreen";

export const Route = createFileRoute("/game/narration")({
    component: NarrationElement,
});

function NarrationElement() {
    return (
        <>
            <HistoryScreen />
            <NarrationClickOverlay />
            <NarrationScreen />
            <QuickTools />
            <NarrationDetectors />
            <VisibilityButton />
        </>
    );
}

function NarrationClickOverlay() {
    const { handlePointerDown, handlePointerUp } = useNarrationPointerHandlers();
    return (
        <div
            className="fixed inset-0 z-0 pointer-events-auto"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
        />
    );
}

function NarrationDetectors() {
    useSkipAutoDetector();
    return <></>;
}
