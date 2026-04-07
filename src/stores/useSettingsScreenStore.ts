import { Store } from "@tanstack/store";

type SettingsScreenState = {
    /**
     * Whether the screen is open
     */
    open: boolean;
};

export const settingsScreenStore = new Store<SettingsScreenState>({ open: false });

/**
 * Toggle the settings screen open state
 */
export const editOpen = () =>
    settingsScreenStore.setState((state) => ({ ...state, open: !state.open }));

/**
 * Set the open state of the settings screen
 */
export const setOpen = (value: boolean) =>
    settingsScreenStore.setState((state) => ({ ...state, open: value }));
