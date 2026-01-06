import { stepHistory, StepLabelProps } from "@drincs/pixi-vn";
import { narration } from "@drincs/pixi-vn/narration";
import { useQueryClient } from "@tanstack/react-query";
import { throttle } from "es-toolkit";
import { useCallback, useEffect, useRef } from "react";
import { HTML_CANVAS_LAYER_NAME, HTML_UI_LAYER_NAME } from "../constans";
import useStepStore from "../stores/useStepStore";
import useGameProps from "./useGameProps";
import { INTERFACE_DATA_USE_QUEY_KEY } from "./useQueryInterface";

function isScrollableElement(element: HTMLElement | null): boolean {
    if (!element) return false;

    const style = window.getComputedStyle(element);
    const overflowY = style.overflowY;

    const isScrollable =
        (overflowY === "auto" || overflowY === "scroll") && element.scrollHeight > element.clientHeight;

    return isScrollable;
}

function hasScrollableParent(target: EventTarget | null): boolean {
    let el = target as HTMLElement | null;

    while (el) {
        if (isScrollableElement(el)) {
            return true;
        }
        el = el.parentElement;
    }

    return false;
}

function isInsideRoot(target: EventTarget | null, selector: string): boolean {
    if (!(target instanceof HTMLElement)) return false;
    return target.closest("#" + selector) !== null;
}

export function useWheelActions({
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
            if (!(isInsideRoot(event.target, HTML_UI_LAYER_NAME) || isInsideRoot(event.target, HTML_CANVAS_LAYER_NAME)))
                return;
            if (hasScrollableParent(event.target)) return;

            // blocca lo scroll nativo
            event.preventDefault();

            const { deltaY } = event;

            // ignora micro-movimenti del trackpad
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
