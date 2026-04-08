import { Store } from "@tanstack/store";

type HistoryScreenState = {
    /**
     * Whether the screen is open
     */
    open: boolean;
};

export const historyScreenStore = new Store<HistoryScreenState>({ open: false });

/**
 * Toggle the open state of the history screen
 */
export function toggleHistoryScreenOpen() {
    historyScreenStore.setState((state) => ({ ...state, open: !state.open }));
}

/**
 * Set the open state of the history screen
 */
export function setHistoryScreenOpen(value: boolean) {
    historyScreenStore.setState((state) => ({ ...state, open: value }));
}
