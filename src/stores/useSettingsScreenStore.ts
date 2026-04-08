import { Store } from "@tanstack/store";

type SettingsScreenState = {
    /**
     * Whether the screen is open
     */
    open: boolean;
};

export const settingsScreenStore = new Store<SettingsScreenState>({ open: false });

/**
 * Toggle the open state of the settings screen
 */
export function toggleSettingsScreenOpen() {
    settingsScreenStore.setState((state) => ({ ...state, open: !state.open }));
}

/**
 * Set the open state of the settings screen
 */
export function setSettingsScreenOpen(value: boolean) {
    settingsScreenStore.setState((state) => ({ ...state, open: value }));
}
