import { Store } from "@tanstack/store";

type HistoryScreenState = {
    /**
     * Whether the screen is open
     */
    open: boolean;
};

export const historyScreenStore = new Store<HistoryScreenState>({ open: false });

/**
 * Toggle the history screen open state
 */
export const editOpen = () =>
    historyScreenStore.setState((state) => ({ ...state, open: !state.open }));

/**
 * Set the open state of the history screen
 */
export const setOpen = (value: boolean) =>
    historyScreenStore.setState((state) => ({ ...state, open: value }));
