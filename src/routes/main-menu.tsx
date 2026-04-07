import { createFileRoute } from "@tanstack/react-router";
import MainMenu from "../screens/MainMenu";

export const Route = createFileRoute("/main-menu")({
    component: MainMenu,
});
