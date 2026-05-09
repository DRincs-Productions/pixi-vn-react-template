import { MainMenu } from "@/components/menus/main-menu";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: MainMenu,
});
