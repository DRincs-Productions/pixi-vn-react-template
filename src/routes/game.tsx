import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/game")({
    component: GameElement,
});

function GameElement() {
    return <Outlet />;
}
