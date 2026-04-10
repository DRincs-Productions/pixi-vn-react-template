import { Store } from "@tanstack/store";
import { useStore } from "@tanstack/react-store";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";

/**
 * Internal store used as an instant-read cache for URL search params.
 * This avoids the browser-level delay of `useSearch` when params are
 * set programmatically via `navigate()`.
 */
const _searchParamStore = new Store<Record<string, unknown>>({});

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
    const storeValue = useStore(_searchParamStore, (state) => state[field]) as T | undefined;

    useEffect(() => {
        _searchParamStore.setState((state) => ({ ...state, [field]: valueFromUrl }));
    }, [field, valueFromUrl]);

    // On first render, the store hasn't been synced yet, so fall back to the URL value.
    return storeValue ?? valueFromUrl;
}

/**
 * Returns a stable setter for the given URL search param.
 *
 * Calling the setter instantly updates the internal store (so components
 * re-render without waiting for the URL update) and then also calls
 * `navigate()` to keep the URL in sync.
 *
 * Pass `undefined` to remove the param from the URL.
 *
 * @param field - The search param key to write.
 * @returns A stable callback `(value: T | undefined) => void`.
 */
export function useSetSearchParamState<T>(field: string): (value: T | undefined) => void {
    const navigate = useNavigate();

    return useCallback(
        (value: T | undefined) => {
            _searchParamStore.setState((state) => ({ ...state, [field]: value }));
            navigate({ search: ((prev: any) => ({ ...prev, [field]: value })) as any });
        },
        [field, navigate],
    );
}
