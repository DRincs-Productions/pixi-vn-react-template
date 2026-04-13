import { createFileRoute } from "@tanstack/react-router";
import NarrationScreen from "@/components/menus/narration";
import { QuickTools } from "@/components/menus/quick-tools";
import NextButton from "@/components/NextButton";
import VisibilityButton from "@/components/VisibilityButton";
import useSkipAutoDetector from "@/hooks/useSkipAutoDetector";
import HistoryScreen from "@/screens/HistoryScreen";

export const Route = createFileRoute("/game/narration")({
    component: NarrationElement,
});

function NarrationElement() {
    return (
        <>
            <HistoryScreen />
            <NarrationScreen />
            <QuickTools />
            <NextButton />
            <NarrationDetectors />
            <VisibilityButton />
        </>
    );
}

function NarrationDetectors() {
    useSkipAutoDetector();
    return <></>;
}
