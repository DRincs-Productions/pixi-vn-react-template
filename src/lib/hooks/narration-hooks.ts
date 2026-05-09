import { useGameProps } from "@/lib/hooks/props-hooks";
import { GameStatus } from "@/lib/stores/game-status-store";
import { SkipSettings } from "@/lib/stores/skip-settings-store";
import { hasScrollableParent, isScrollableElement } from "@/lib/utils/scroll-utils";
import { narration, stepHistory, type StoredIndexedChoiceInterface } from "@drincs/pixi-vn";
import { useStore } from "@tanstack/react-store";
import type React from "react";
import { useCallback, useRef } from "react";

export function useNarrationFunctions() {
    const gameProps = useGameProps();

    const goNext = useCallback(async () => {
        GameStatus.setLoading(true);
        try {
            if (!narration.canContinue) {
                GameStatus.setLoading(false);
                return;
            }
            return narration
                .continue(gameProps)
                .then(() => {
                    gameProps.invalidateInterfaceData();
                    GameStatus.setLoading(false);
                })
                .catch((e) => {
                    GameStatus.setLoading(false);
                    console.error(e);
                });
        } catch (e) {
            GameStatus.setLoading(false);
            console.error(e);
            return;
        }
    }, [gameProps]);

    const goBack = useCallback(async () => {
        GameStatus.setLoading(true);
        return stepHistory
            .back(gameProps)
            .then(() => {
                GameStatus.setLoading(false);
                gameProps.invalidateInterfaceData();
            })
            .catch((e) => {
                GameStatus.setLoading(false);
                console.error(e);
            });
    }, [gameProps]);

    const selectChoice = useCallback(
        async (item: StoredIndexedChoiceInterface) => {
            GameStatus.setLoading(true);
            return narration
                .selectChoice(item, gameProps)
                .then(() => {
                    gameProps.invalidateInterfaceData();
                    GameStatus.setLoading(false);
                })
                .catch((e) => {
                    GameStatus.setLoading(false);
                    console.error(e);
                });
        },
        [gameProps],
    );

    return {
        goNext,
        goBack,
        selectChoice,
    };
}

/** Maximum pointer displacement (px) between pointerdown and pointerup that is still considered a tap/click. */
const DRAG_THRESHOLD_PX = 5;
export function useNarrationPointerHandlers() {
    const { goNext } = useNarrationFunctions();
    const skipEnabled = useStore(SkipSettings.store, (state) => state.enabled);
    const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        if (e.button !== 0) return;
        if (hasScrollableParent(e.target)) return;
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
    }, []);

    /**
     * Clear the pending gesture on cancel.
     * react-resizable-panels calls setPointerCapture() on the separator element in its
     * pointermove handler (NOT in pointerdown), so the overlay never receives a native
     * pointercancel when the separator takes over the drag. This handler ensures the ref
     * is cleaned up in the cases where the browser itself cancels the gesture.
     */
    const handlePointerCancel = useCallback(() => {
        pointerDownPos.current = null;
    }, []);

    const handlePointerUp = useCallback(
        (e: React.PointerEvent) => {
            // Only fire if a matching pointerdown was recorded on this element.
            // If pointerdown started on a higher-z element (e.g. a resize handle),
            // the ref will be null and we must not advance the narration.
            if (!pointerDownPos.current) return;

            const dx = e.clientX - pointerDownPos.current.x;
            const dy = e.clientY - pointerDownPos.current.y;
            pointerDownPos.current = null;

            // If the pointer moved significantly it was a drag (e.g. resize), not a tap.
            if (dx * dx + dy * dy > DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) return;

            // Let resize handles manage their own drag behaviour
            if ((e.target as HTMLElement).closest('[data-slot="resizable-handle"]')) return;
            // Let native scrollbar interactions through
            if (isScrollableElement(e.target as HTMLElement)) return;

            if (skipEnabled) {
                SkipSettings.setEnabled(false);
            }
            goNext();
        },
        [goNext, skipEnabled],
    );

    return { handlePointerDown, handlePointerCancel, handlePointerUp };
}
