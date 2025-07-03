import { useMemo } from "react";

export function useOpacityTranslateMotion(props: {
    hidden?: boolean;
    distance?: number;
    direction?: "up" | "down" | "left" | "right";
}) {
    const { hidden = false, distance = 100, direction = "down" } = props;

    return useMemo(
        () =>
            `motion-opacity-${hidden ? "out" : "in"}-0 motion-translate-${
                direction === "up" || direction === "down" ? "y" : "x"
            }-${hidden ? "out" : "in"}-[${distance * (direction === "up" || direction === "left" ? -1 : 1)}%]`,
        [hidden, distance, direction]
    );
}
