import { createFileRoute } from "@tanstack/react-router";
import LoadingScreen from "../screens/LoadingScreen";

export const Route = createFileRoute("/loading")({
    component: LoadingScreen,
});
