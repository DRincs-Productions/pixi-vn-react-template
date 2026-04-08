import { Store } from "@tanstack/store";

type SkipSettingsState = {
    /**
     * Whether the skip is enabled
     */
    enabled: boolean;
};

export namespace SkipSettings {
    export const store = new Store<SkipSettingsState>({ enabled: false });

    /**
     * Toggle the skip state
     */
    export function toggleEnabled() {
        store.setState((state) => ({ ...state, enabled: !state.enabled }));
    }

    /**
     * Set the skip state
     */
    export function setEnabled(value: boolean) {
        store.setState((state) => ({ ...state, enabled: value }));
    }
}
