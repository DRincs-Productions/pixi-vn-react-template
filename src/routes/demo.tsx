import useGameProps from "@/hooks/useGameProps";
import startLabel from "@/labels/startLabel";
import { Game } from "@drincs/pixi-vn";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/demo")({
    component: Demo,
});

function Demo() {
    const props = useGameProps();

    useEffect(() => {
        props.navigate({ to: "/game/narration" }).then(() => {
            Game.start(startLabel, props);
        });
    }, [props]);

    return null;
}
