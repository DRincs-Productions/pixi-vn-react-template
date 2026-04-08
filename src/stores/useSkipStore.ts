import { Store } from "@tanstack/store";

type SkipStoreState = {
    /**
     * Whether the skip is enabled
     */
    enabled: boolean;
};

export const skipStore = new Store<SkipStoreState>({ enabled: false });

/**
 * Toggle the skip state
 */
export function editSkipEnabled() {
    skipStore.setState((state) => ({ ...state, enabled: !state.enabled }));
}

/**
 * Set the skip state
 */
export function setSkipEnabled(value: boolean) {
    skipStore.setState((state) => ({ ...state, enabled: value }));
}
