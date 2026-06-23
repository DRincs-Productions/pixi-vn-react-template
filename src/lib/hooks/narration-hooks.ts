import { SKIP_DELAY } from "@/constants";
import { useGameProps } from "@/lib/hooks/props-hooks";
import { AutoSettings } from "@/lib/stores/auto-settings-store";
import { GameStatus } from "@/lib/stores/game-status-store";
import { SearchParams } from "@/lib/stores/search-param-store";
import { SkipSettings } from "@/lib/stores/skip-settings-store";
import { TextDisplaySettings } from "@/lib/stores/text-display-settings-store";
import { hasScrollableParent, isScrollableElement } from "@/lib/utils/scroll-utils";
import { narration, stepHistory, type StoredIndexedChoiceInterface } from "@drincs/pixi-vn";
import { useDebouncer } from "@tanstack/react-pacer";
import { useSelector } from "@tanstack/react-store";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";

export function useNarrationFunctions() {
    const gameProps = useGameProps();
    const searchParams = useSelector(SearchParams.store, (state) => state);
    const hasOpenMenu = useMemo(
        () => Object.values(searchParams).some((value) => value !== undefined),
        [searchParams],
    );

    const goNext = useCallback(async () => {
        if (hasOpenMenu) return;
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
    }, [gameProps, hasOpenMenu]);

    const goBack = useCallback(async () => {
        if (hasOpenMenu) return;
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
    }, [gameProps, hasOpenMenu]);

    const selectChoice = useCallback(
        async (item: StoredIndexedChoiceInterface) => {
            if (hasOpenMenu) return;
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
        [gameProps, hasOpenMenu],
    );

    return {
        goNext,
        goBack,
        selectChoice,
    };
}

/** Maximum pointer displacement (px) between pointerdown and pointerup that is still considered a tap/click. */
const DRAG_THRESHOLD_PX = 5;
const LONG_PRESS_SKIP_DELAY_MS = 700;
const isDragGesture = (dx: number, dy: number) =>
    dx * dx + dy * dy > DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX;

export function useNarrationPointerHandlers() {
    const { goNext } = useNarrationFunctions();
    const skipEnabled = useSelector(SkipSettings.store, (state) => state.enabled);
    const pointerDownPos = useRef<{ x: number; y: number } | null>(null);
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const longPressTriggered = useRef(false);

    const clearLongPressTimer = useCallback(() => {
        if (!longPressTimer.current) return;
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
    }, []);

    const handlePointerDown = useCallback(
        (e: React.PointerEvent) => {
            if (e.button !== 0) return;
            if (hasScrollableParent(e.target)) return;

            longPressTriggered.current = false;
            pointerDownPos.current = { x: e.clientX, y: e.clientY };
            clearLongPressTimer();
            longPressTimer.current = setTimeout(() => {
                if (!pointerDownPos.current) return;
                longPressTriggered.current = true;
                SkipSettings.setEnabled(true);
            }, LONG_PRESS_SKIP_DELAY_MS);
        },
        [clearLongPressTimer],
    );

    /**
     * Clear the pending gesture on cancel.
     * react-resizable-panels calls setPointerCapture() on the separator element in its
     * pointermove handler (NOT in pointerdown), so the overlay never receives a native
     * pointercancel when the separator takes over the drag. This handler ensures the ref
     * is cleaned up in the cases where the browser itself cancels the gesture.
     */
    const handlePointerCancel = useCallback(() => {
        clearLongPressTimer();
        pointerDownPos.current = null;
        if (longPressTriggered.current) {
            SkipSettings.setEnabled(false);
            longPressTriggered.current = false;
        }
    }, [clearLongPressTimer]);

    const handlePointerUp = useCallback(
        (e: React.PointerEvent) => {
            // Only fire if a matching pointerdown was recorded on this element.
            // If pointerdown started on a higher-z element (e.g. a resize handle),
            // the ref will be null and we must not advance the narration.
            if (!pointerDownPos.current) return;

            const dx = e.clientX - pointerDownPos.current.x;
            const dy = e.clientY - pointerDownPos.current.y;
            clearLongPressTimer();
            pointerDownPos.current = null;

            // If the pointer moved significantly it was a drag (e.g. resize), not a tap.
            if (isDragGesture(dx, dy)) return;

            // Let resize handles manage their own drag behaviour
            if ((e.target as HTMLElement).closest('[data-slot="resizable-handle"]')) return;
            // Let native scrollbar interactions through
            if (isScrollableElement(e.target as HTMLElement)) return;

            if (longPressTriggered.current) {
                SkipSettings.setEnabled(false);
                longPressTriggered.current = false;
                return;
            }

            if (skipEnabled) {
                SkipSettings.setEnabled(false);
            }
            goNext();
        },
        [clearLongPressTimer, goNext, skipEnabled],
    );

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!pointerDownPos.current) return;
            const dx = e.clientX - pointerDownPos.current.x;
            const dy = e.clientY - pointerDownPos.current.y;
            if (!isDragGesture(dx, dy)) return;
            clearLongPressTimer();
            pointerDownPos.current = null;
            if (longPressTriggered.current) {
                SkipSettings.setEnabled(false);
                longPressTriggered.current = false;
            }
        },
        [clearLongPressTimer],
    );

    useEffect(
        () => () => {
            clearLongPressTimer();
        },
        [clearLongPressTimer],
    );

    return { handlePointerDown, handlePointerCancel, handlePointerMove, handlePointerUp };
}

export function useSkipAutoDetector() {
    const skipEnabled = useSelector(SkipSettings.store, (state) => state.enabled);
    const autoEnabled = useSelector(AutoSettings.store, (state) => state.enabled);
    const autoTime = useSelector(AutoSettings.store, (state) => state.time);
    const typewriterInProgress = useSelector(
        TextDisplaySettings.store,
        (state) => state.inProgress,
    );
    const searchParams = useSelector(SearchParams.store, (state) => state);
    const hasOpenMenu = useMemo(
        () => Object.values(searchParams).some((value) => value !== undefined),
        [searchParams],
    );
    const { goNext } = useNarrationFunctions();

    const savedGoNext = useRef(goNext);
    useEffect(() => {
        savedGoNext.current = goNext;
    }, [goNext]);
    useEffect(() => {
        if (skipEnabled && !hasOpenMenu) {
            const id = setInterval(() => savedGoNext.current(), SKIP_DELAY);
            return () => clearInterval(id);
        }
    }, [skipEnabled, hasOpenMenu]);

    const autoDebouncer = useDebouncer(
        (_trigger: {
            autoEnabled: boolean;
            skipEnabled: boolean;
            typewriterInProgress: boolean;
            autoTime: number;
            hasOpenMenu: boolean;
        }) => {
            goNext();
        },
        {
            wait: autoTime * 1000,
            enabled: autoEnabled && !skipEnabled && !typewriterInProgress && !hasOpenMenu,
        },
    );

    const { maybeExecute } = autoDebouncer;

    useEffect(() => {
        maybeExecute({ autoEnabled, skipEnabled, typewriterInProgress, autoTime, hasOpenMenu });
    }, [maybeExecute, autoEnabled, skipEnabled, typewriterInProgress, autoTime, hasOpenMenu]);

    return null;
}
