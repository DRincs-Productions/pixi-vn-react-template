import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * useConfirmBackNavigation
 *
 * Prevent accidental browser "back" navigation.
 * Behavior:
 * - On each `href` change it pushes a history state (`pushState`).
 * - Listens for `popstate` and calls `history.forward()` to cancel a single
 *   press of the browser back button.
 * - If the user presses back twice in succession (i.e. the second press occurs
 *   before the first is handled), the browser will navigate back.
 *
 * Usage: call this hook at the app root to avoid unintended back navigations
 * (e.g. accidental taps or gestures). Returns `null`.
 */
export default function useConfirmBackNavigation() {
    const { href } = useLocation();

    useEffect(() => {
        const isInIframe = typeof window !== "undefined" && window.self !== window.top;
        if (isInIframe) return;
        const listener = () => {
            window.history.forward();
        };
        window.addEventListener("popstate", listener);

        return () => {
            window.removeEventListener("popstate", listener);
        };
    }, []);

    useEffect(() => {
        window.history.pushState(null, href, href);
    }, [href]);

    return null;
}
