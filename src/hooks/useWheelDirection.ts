import { stepHistory } from "@drincs/pixi-vn";
import { narration, StepLabelProps } from "@drincs/pixi-vn/narration";
import { useQueryClient } from "@tanstack/react-query";
import { throttle } from "es-toolkit";
import { useCallback, useEffect, useRef } from "react";
import useStepStore from "../stores/useStepStore";
import useGameProps from "./useGameProps";
import { INTERFACE_DATA_USE_QUEY_KEY } from "./useQueryInterface";

export function useWheelDirection({
    throttleMs = 300,
    minDelta = 20,
}: {
    throttleMs?: number;
    minDelta?: number;
} = {}) {
    const pendingAsync = useRef(0);
    const setLoading = useStepStore((state) => state.setLoading);
    const queryClient = useQueryClient();
    const gameProps = useGameProps();

    const runAsync = async (fn: (props: StepLabelProps) => Promise<unknown>) => {
        try {
            pendingAsync.current += 1;
            setLoading(pendingAsync.current > 0);
            await fn(gameProps);
        } finally {
            pendingAsync.current -= 1;
            setLoading(pendingAsync.current > 0);
            if (pendingAsync.current === 0) {
                queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] });
            }
        }
    };

    const handleWheel = useCallback(
        throttle(async (event: WheelEvent) => {
            event.preventDefault();

            const { deltaY } = event;

            if (Math.abs(deltaY) < minDelta) return;

            if (deltaY < 0) {
                // ⬆️ Scroll up
                await runAsync(narration.continue.bind(narration));
            }

            if (deltaY > 0) {
                // ⬇️ Scroll down
                await runAsync(stepHistory.back.bind(stepHistory));
            }
        }, throttleMs),
        [throttleMs, minDelta]
    );

    useEffect(() => {
        window.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            window.removeEventListener("wheel", handleWheel);
            handleWheel.cancel();
        };
    }, [handleWheel]);

    return null;
}
