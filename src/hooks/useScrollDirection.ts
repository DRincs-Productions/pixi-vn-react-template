import { stepHistory } from "@drincs/pixi-vn";
import { narration, StepLabelProps } from "@drincs/pixi-vn/narration";
import { useQueryClient } from "@tanstack/react-query";
import { throttle } from "es-toolkit";
import { useCallback, useEffect, useRef } from "react";
import useStepStore from "../stores/useStepStore";
import useGameProps from "./useGameProps";
import { INTERFACE_DATA_USE_QUEY_KEY } from "./useQueryInterface";

export function useScrollDirection({ throttleMs = 300 }: { throttleMs?: number } = {}) {
    const lastScrollY = useRef(0);
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

    const handleScroll = useCallback(
        throttle(async () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY.current) {
                // ⬆️ Scroll up
                await runAsync(narration.continue);
            }

            if (currentScrollY > lastScrollY.current) {
                // ⬇️ Scroll down
                await runAsync(stepHistory.back);
            }

            lastScrollY.current = currentScrollY;
        }, throttleMs),
        [throttleMs]
    );

    useEffect(() => {
        lastScrollY.current = window.scrollY;

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            handleScroll.cancel();
        };
    }, [handleScroll]);

    return null;
}
