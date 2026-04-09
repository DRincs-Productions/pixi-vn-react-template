import { createFileRoute, redirect } from "@tanstack/react-router";

// Redirect for old versions that used /narration
export const Route = createFileRoute("/narration")({
    beforeLoad: () => {
        throw redirect({ to: "/game/narration" });
    },
    component: () => null,
});
