import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import { useCallback } from "react";

/**
 * Module-level store used as the source of truth for URL search params.
 * Values are written by `useSetSearchParamState` and read by `useSearchParamState`.
 */
const searchParamStore = new Store<Record<string, unknown>>({});

/**
 * Returns the current value of the given URL search param from the internal store.
 *
 * @param field - The search param key to read.
 * @returns The current value, or `undefined` if not set.
 */
export function useSearchParamState<T>(field: string): T | undefined {
    const storeValue = useStore(searchParamStore, (state) => state[field]) as T | undefined;
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
            if (value === false) value = undefined;
            searchParamStore.setState((state) => ({ ...state, [field]: value }));
            debouncedNavigate(field, value);
        },
        [field, debouncedNavigate],
    );
}
