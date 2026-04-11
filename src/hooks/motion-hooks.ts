import { useMemo } from "react";

export function useOpacityTranslateMotion(props: {
    hidden?: boolean;
    distance?: number;
    direction?: "up" | "down" | "left" | "right";
}) {
    const { hidden = false, distance = 100, direction = "down" } = props;

    return useMemo(() => {
        const slideDirection = hidden
            ? {
                  up: "slide-out-to-top",
                  down: "slide-out-to-bottom",
                  left: "slide-out-to-left",
                  right: "slide-out-to-right",
              }[direction]
            : {
                  up: "slide-in-from-top",
                  down: "slide-in-from-bottom",
                  left: "slide-in-from-left",
                  right: "slide-in-from-right",
              }[direction];

        return `${hidden ? "animate-out fade-out-0" : "animate-in fade-in-0"} ${slideDirection}-[${distance}%]`;
    }, [hidden, distance, direction]);
}
