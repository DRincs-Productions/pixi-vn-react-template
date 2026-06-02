import { InputRequestDialog } from "@/components/modals/input-request-dialogues";
import { QuickActionsWheel } from "@/components/modals/quick-actions-wheel";
import { useGameHotkeys } from "@/lib/hooks/hotkeys-hooks";
import { usePauseGameWhenMenuIsOpen } from "@/lib/hooks/pause-game-hooks";
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
