import { QuickActionsWheel } from "@/components/menus/quick-actions-wheel";
import { InputRequestDialog } from "@/components/modals/input-request-dialogues";
import { useGameHotkeys } from "@/hooks/hotkeys-hooks";
import usePauseGameWhenMenuIsOpen from "@/hooks/usePauseGameWhenMenuIsOpen";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/game")({
    component: GameElement,
});

function GameElement() {
    usePauseGameWhenMenuIsOpen();
    useGameHotkeys();

    return (
        <>
            <InputRequestDialog />
            <QuickActionsWheel />
            <Outlet />
        </>
    );
}
