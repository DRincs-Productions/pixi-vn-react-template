import { Store } from "@tanstack/store";

type SkipStoreState = {
    /**
     * Whether the skip is enabled
     */
    enabled: boolean;
};

export namespace SkipStore {
    export const store = new Store<SkipStoreState>({ enabled: false });

    /**
     * Toggle the skip state
     */
    export function editEnabled() {
        store.setState((state) => ({ ...state, enabled: !state.enabled }));
    }

    /**
     * Set the skip state
     */
    export function setEnabled(value: boolean) {
        store.setState((state) => ({ ...state, enabled: value }));
    }
}
