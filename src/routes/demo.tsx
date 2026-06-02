import { startLabel } from "@/content/labels/start.label";
import { useGameProps } from "@/lib/hooks/props-hooks";
import { Game } from "@drincs/pixi-vn";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/demo")({
    component: Demo,
});

function Demo() {
    const props = useGameProps();

    useEffect(() => {
        setTimeout(async () => {
            props.navigate({ to: "/game/narration" }).then(() => {
                Game.start(startLabel, props).then(() => {
                    props.invalidateInterfaceData();
                });
            });
        }, 100);
    }, [props]);

    return null;
}
