import { useStore } from "@tanstack/react-store";
import type React from "react";
import { useCallback, useRef } from "react";
import { SkipSettings } from "@/lib/stores/skip-settings-store";
import { hasScrollableParent, isScrollableElement } from "@/utils/scroll-utils";
import useNarrationFunctions from "./useNarrationFunctions";

export default function useNarrationPointerHandlers() {
    const { goNext } = useNarrationFunctions();
    const skipEnabled = useStore(SkipSettings.store, (state) => state.enabled);
    const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        if (e.button !== 0) return;
        if (hasScrollableParent(e.target)) return;
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
    }, []);

    const handlePointerUp = useCallback(
        (e: React.PointerEvent) => {
            // Only fire if a matching pointerdown was recorded on this overlay.
            // If pointerdown started on a higher-z element (e.g. a resize handle),
            // the ref will be null and we must not advance the narration.
            if (!pointerDownPos.current) return;
            pointerDownPos.current = null;

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

    return { handlePointerDown, handlePointerUp };
}
