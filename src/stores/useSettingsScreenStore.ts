import { Store } from "@tanstack/store";

type SettingsScreenState = {
    /**
     * Whether the screen is open
     */
    open: boolean;
};

export namespace SettingsScreenStore {
    export const store = new Store<SettingsScreenState>({ open: false });

    /**
     * Toggle the open state of the settings screen
     */
    export function toggleOpen() {
        store.setState((state) => ({ ...state, open: !state.open }));
    }

    /**
     * Set the open state of the settings screen
     */
    export function setOpen(value: boolean) {
        store.setState((state) => ({ ...state, open: value }));
    }
}
