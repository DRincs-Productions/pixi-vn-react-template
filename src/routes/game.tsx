import { HistoryMenu } from "@/components/menus/history";
import { InputRequestDialog } from "@/components/modals/input-request-dialogues";
import usePauseGameWhenMenuIsOpen from "@/hooks/usePauseGameWhenMenuIsOpen";
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
    usePauseGameWhenMenuIsOpen();
    return (
        <>
            <InputRequestDialog />
            <HistoryMenu />
            <Outlet />
        </>
    );
}
