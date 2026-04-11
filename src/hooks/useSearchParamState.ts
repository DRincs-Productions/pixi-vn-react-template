import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import { useCallback, useEffect } from "react";

/**
 * Module-level store used as an instant-read cache for URL search params.
 * This avoids the browser-level delay of `useSearch` when params are
 * set programmatically via `navigate()`.
 */
const searchParamStore = new Store<Record<string, unknown>>({});

/**
 * Returns the current value of the given URL search param.
 *
 * The value is read from an internal store that is synced from the URL, so
 * it updates instantly when changed via `useSetSearchParamState` and also
 * correctly tracks external navigation (browser back/forward).
 *
 * @param field - The search param key to read.
 * @returns The current value, or `undefined` if not set.
 */
export function useSearchParamState<T>(field: string): T | undefined {
    const search = useSearch({ strict: false });
    const valueFromUrl = (search as Record<string, unknown>)[field] as T | undefined;
    const storeValue = useStore(searchParamStore, (state) => state[field]) as T | undefined;

    useEffect(() => {
        // Only write to the store when the URL value genuinely differs from what the
        // store already holds.  This prevents the redundant setState (and its extra
        // re-render) that would otherwise fire ~300 ms after every
        // useSetSearchParamState call, once the debounced navigate() settles.
        // The effect still runs for real external URL changes (browser back/forward).
        if (searchParamStore.state[field] !== valueFromUrl) {
            searchParamStore.setState((state) => ({ ...state, [field]: valueFromUrl }));
        }
    }, [field, valueFromUrl]);

    // On first render, the store hasn't been synced yet, so fall back to the URL value.
    return storeValue ?? valueFromUrl;
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
 * @returns A stable callback `(value: T | undefined) => void`.
 */
export function useSetSearchParamState<T>(field: string): (value: T | undefined) => void {
    const navigate = useNavigate();

    const debouncedNavigate = useDebouncedCallback(
        (key: string, value: unknown) => {
            navigate({ search: ((prev: any) => ({ ...prev, [key]: value })) as any });
        },
        { wait: 300 },
    );

    return useCallback(
        (value: T | undefined) => {
            searchParamStore.setState((state) => ({ ...state, [field]: value }));
            debouncedNavigate(field, value);
        },
        [field, debouncedNavigate],
    );
}
