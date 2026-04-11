import { createFileRoute, Outlet } from "@tanstack/react-router";
import { InputRequestDialog } from "@/components/modals/input-request-dialogues";

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
            <Outlet />
        </>
    );
}
