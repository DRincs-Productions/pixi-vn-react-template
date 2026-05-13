import { startLabel } from "@/content/labels/start-label";
import { useGameProps } from "@/lib/hooks/props-hooks";
import { Game } from "@drincs/pixi-vn";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/demo")({
    component: Demo,
});

function Demo() {
    const props = useGameProps();
    const nevigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            nevigate({ to: "/game/narration" }).then(() => {
                Game.start(startLabel, props);
            });
        }, 1000);
    }, [props, nevigate]);

    return null;
}
