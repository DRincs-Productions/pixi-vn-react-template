import { type StepLabelProps, stepHistory } from "@drincs/pixi-vn";
import { narration } from "@drincs/pixi-vn/narration";
import { useThrottler } from "@tanstack/react-pacer";
import { useEffect, useRef } from "react";
import { HTML_CANVAS_LAYER_NAME, HTML_UI_LAYER_NAME } from "@/constans";
import useGameProps from "@/hooks/useGameProps";
import { GameStatus } from "@/lib/stores/game-status-store";
import { hasScrollableParent } from "@/utils/scroll-utils";

function isInsideRoot(target: EventTarget | null, selector: string): boolean {
    if (!(target instanceof HTMLElement)) return false;
    return target.closest(`#${selector}`) !== null;
}

export function useWheelActions({
    throttleMs = 300,
    minDelta = 20,
}: {
    throttleMs?: number;
    minDelta?: number;
} = {}) {
    const pendingAsync = useRef(0);
    const gameProps = useGameProps();

    const runAsync = async (fn: (props: StepLabelProps) => Promise<unknown>) => {
        try {
            pendingAsync.current += 1;
            GameStatus.setLoading(pendingAsync.current > 0);
            await fn(gameProps);
        } finally {
            pendingAsync.current -= 1;
            GameStatus.setLoading(pendingAsync.current > 0);
            if (pendingAsync.current === 0) {
                gameProps.invalidateInterfaceData();
            }
        }
    };

    const handleWheel = useThrottler(
        async (event: WheelEvent) => {
            if (
                !(
                    isInsideRoot(event.target, HTML_UI_LAYER_NAME) ||
                    isInsideRoot(event.target, HTML_CANVAS_LAYER_NAME)
                )
            )
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
        },
        { wait: throttleMs },
    );

    useEffect(() => {
        window.addEventListener("wheel", handleWheel.maybeExecute, { passive: false });

        return () => {
            window.removeEventListener("wheel", handleWheel.maybeExecute);
        };
    }, [handleWheel.maybeExecute]);

    return null;
}
