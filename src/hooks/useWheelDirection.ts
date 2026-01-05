import { stepHistory, StepLabelProps } from "@drincs/pixi-vn";
import { narration } from "@drincs/pixi-vn/narration";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import useStepStore from "../stores/useStepStore";
import useGameProps from "./useGameProps";
import { INTERFACE_DATA_USE_QUEY_KEY } from "./useQueryInterface";

export function useWheelActions({
    stepSize = 120,
    blockMs = 10000,
    pauseMs = 150,
}: {
    stepSize?: number;
    blockMs?: number;
    pauseMs?: number;
} = {}) {
    const accumulatedDelta = useRef(0);
    const pendingAsync = useRef(0);
    const isBlocked = useRef(false);
    const lastWheelAt = useRef(0);
    const blockTimer = useRef<number | null>(null);
    const setLoading = useStepStore((state) => state.setLoading);
    const queryClient = useQueryClient();
    const gameProps = useGameProps();

    const runAsync = async (fn: (props: StepLabelProps) => Promise<unknown>) => {
        try {
            pendingAsync.current += 1;
            setLoading(true);
            await fn(gameProps);
        } finally {
            pendingAsync.current -= 1;
            setLoading(pendingAsync.current > 0);
            if (pendingAsync.current === 0) {
                queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] });
            }
        }
    };

    const triggerOnce = (direction: number) => {
        if (direction > 0) {
            // ⬇️ Scroll down
            runAsync(stepHistory.back.bind(stepHistory));
        } else {
            // ⬆️ Scroll up
            runAsync(narration.continue.bind(narration));
        }
    };

    const startBlock = () => {
        console.log("Wheel scroll blocked");
        isBlocked.current = true;

        if (blockTimer.current !== null) {
            window.clearTimeout(blockTimer.current);
        }

        blockTimer.current = window.setTimeout(() => {
            console.log("Wheel scroll unblocked");
            isBlocked.current = false;

            const now = performance.now();

            // If last wheel movement was too old, reset everything
            if (now - lastWheelAt.current > pauseMs) {
                accumulatedDelta.current = 0;
            }
        }, blockMs);
    };

    const handleWheel = useCallback(
        (event: WheelEvent) => {
            event.preventDefault();

            const now = performance.now();
            lastWheelAt.current = now;
            const delta = event.deltaY;

            // === BLOCKED STATE ===
            console.log("Wheel delta:", delta, "Accumulated:", accumulatedDelta.current, "Blocked:", isBlocked.current);
            if (isBlocked.current) {
                // Ignore actions, only track last wheel time
                return;
            }

            // === IDLE → START MOVEMENT ===
            if (accumulatedDelta.current === 0) {
                triggerOnce(delta);
                startBlock();
                return;
            }

            // === ACTIVE (continuous scroll) ===
            accumulatedDelta.current += delta;

            while (Math.abs(accumulatedDelta.current) >= stepSize) {
                triggerOnce(accumulatedDelta.current);
                accumulatedDelta.current += accumulatedDelta.current > 0 ? -stepSize : stepSize;
            }
        },
        [stepSize, blockMs, pauseMs]
    );

    useEffect(() => {
        window.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            window.removeEventListener("wheel", handleWheel);
            if (blockTimer.current !== null) {
                window.clearTimeout(blockTimer.current);
            }
        };
    }, [handleWheel]);

    return null;
}
