import { createFileRoute } from "@tanstack/react-router";
import MainMenu from "../screens/MainMenu";

export const Route = createFileRoute("/")({
    component: MainMenu,
});
