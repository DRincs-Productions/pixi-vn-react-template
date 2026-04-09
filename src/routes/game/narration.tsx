import { createFileRoute } from "@tanstack/react-router";
import NextButton from "../../components/NextButton";
import VisibilityButton from "../../components/VisibilityButton";
import useSkipAutoDetector from "../../hooks/useSkipAutoDetector";
import HistoryScreen from "../../screens/HistoryScreen";
import TextInput from "../../screens/modals/TextInput";
import NarrationScreen from "../../screens/NarrationScreen";
import QuickTools from "../../screens/QuickTools";

export const Route = createFileRoute("/game/narration")({
    component: NarrationElement,
});

function NarrationElement() {
    return (
        <>
            <HistoryScreen />
            <NarrationScreen />
            <QuickTools />
            <TextInput />
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
