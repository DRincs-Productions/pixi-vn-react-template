import { Store } from "@tanstack/store";

type SkipState = {
    /**
     * Whether the skip is enabled
     */
    enabled: boolean;
};

export const skipStore = new Store<SkipState>({ enabled: false });

/**
 * Toggle the skip state
 */
export const editEnabled = () =>
    skipStore.setState((state) => ({ ...state, enabled: !state.enabled }));

/**
 * Set the skip state
 */
export const setEnabled = (value: boolean) =>
    skipStore.setState((state) => ({ ...state, enabled: value }));
