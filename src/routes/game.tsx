import { HistoryMenu } from "@/components/menus/history";
import QuickActionsWheel from "@/components/menus/quick-actions-wheel";
import { InputRequestDialog } from "@/components/modals/input-request-dialogues";
import { createFileRoute, Outlet } from "@tanstack/react-router";

type Search = {
    /**
     * Whether the history screen is open.
     */
    history?: boolean;
};

export const Route = createFileRoute("/game")({
    validateSearch: (search: Search): Search => search,
    component: GameElement,
});

function GameElement() {
    return (
        <>
            <InputRequestDialog />
            <HistoryMenu />
            <QuickActionsWheel />
            <Outlet />
        </>
    );
}
