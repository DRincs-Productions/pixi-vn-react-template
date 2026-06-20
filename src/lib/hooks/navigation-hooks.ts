import { SearchParams } from "@/lib/stores/search-param-store";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import { useCallback, useEffect } from "react";

// Shared pending param changes — all synchronous setters accumulate here
// and a single navigate fires after a very short delay.
const _pendingParams: Record<string, unknown> = {};
let _pendingTimer: ReturnType<typeof setTimeout> | null = null;
let _pendingNavigate: ((...args: unknown[]) => unknown) | null = null;

function scheduleNavigate(navigate: (...args: unknown[]) => unknown, key: string, value: unknown) {
    _pendingParams[key] = value;
    _pendingNavigate = navigate;
    if (_pendingTimer !== null) {
        clearTimeout(_pendingTimer);
    }
    _pendingTimer = setTimeout(() => {
        _pendingTimer = null;
        if (_pendingNavigate) {
            const snapshot = { ..._pendingParams };
            for (const k of Object.keys(_pendingParams)) {
                delete _pendingParams[k];
            }
            _pendingNavigate({
                search: (prev: Record<string, unknown>) => ({ ...prev, ...snapshot }),
            });
            _pendingNavigate = null;
        }
    }, 10);
}

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
export function useConfirmBackNavigation() {
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

/**
 * Returns the current value of the given URL search param from the internal store.
 *
 * @param field - The search param key to read.
 * @returns The current value, or `undefined` if not set.
 */
export function useSearchParamState<T>(field: string): T | undefined {
    const storeValue = useSelector(SearchParams.store, (state) => state[field]) as T | undefined;
    return storeValue;
}

/**
 * Returns a stable setter for the given URL search param.
 *
 * Calling the setter instantly updates the internal store (so components
 * re-render without waiting for the URL update) and then debounces the
 * `navigate()` call to avoid flooding the browser history on rapid changes.
 *
 * Pass `undefined` to remove the param from the URL.
 *
 * @param field - The search param key to write.
 * @returns A stable callback that accepts either a value or an updater function.
 */
export function useSetSearchParamState<T>(
    field: string,
): (value: T | undefined | ((previous: T | undefined) => T | undefined)) => void {
    const navigate = useNavigate();

    return useCallback(
        (value) => {
            const currentValue = SearchParams.store.state[field] as T | undefined;
            const nextValue =
                typeof value === "function"
                    ? (value as (previous: T | undefined) => T | undefined)(currentValue)
                    : value;
            const normalizedValue = nextValue === false ? undefined : nextValue;

            SearchParams.set(field, normalizedValue);
            scheduleNavigate(navigate as never, field, normalizedValue);
        },
        [field, navigate],
    );
}
