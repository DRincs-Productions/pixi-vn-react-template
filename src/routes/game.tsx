import { QuickActionsWheel } from "@/components/menus/quick-actions-wheel";
import HistorySettingsMenu from "@/components/menus/settings/menus/history";
import { InputRequestDialog } from "@/components/modals/input-request-dialogues";
import usePauseGameWhenMenuIsOpen from "@/hooks/usePauseGameWhenMenuIsOpen";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/game")({
    component: GameElement,
});

function GameElement() {
    usePauseGameWhenMenuIsOpen();
    return (
        <>
            <InputRequestDialog />
            <HistorySettingsMenu />
            <QuickActionsWheel />
            <Outlet />
        </>
    );
}
