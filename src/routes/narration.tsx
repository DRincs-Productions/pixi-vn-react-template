import { createFileRoute } from "@tanstack/react-router";
import NextButton from "../components/NextButton";
import VisibilityButton from "../components/VisibilityButton";
import useSkipAutoDetector from "../hooks/useSkipAutoDetector";
import TextInput from "../screens/modals/TextInput";
import NarrationScreen from "../screens/NarrationScreen";
import QuickTools from "../screens/QuickTools";

export const Route = createFileRoute("/narration")({
    component: NarrationElement,
});

function NarrationElement() {
    return (
        <>
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
