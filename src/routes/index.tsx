import { createFileRoute } from "@tanstack/react-router";
import MainMenu from "@/components/menus/MainMenu";

export const Route = createFileRoute("/")({
    component: MainMenu,
});
