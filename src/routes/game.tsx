import { InputRequestDialog } from "@/components/modals/input-request-dialogues";
import HistoryScreen from "@/screens/HistoryScreen";
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
            <HistoryScreen />
            <Outlet />
        </>
    );
}
