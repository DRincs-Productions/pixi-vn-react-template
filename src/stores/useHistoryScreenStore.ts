import { Store } from "@tanstack/store";

type HistoryScreenState = {
    /**
     * Whether the screen is open
     */
    open: boolean;
};

export namespace HistoryScreenStore {
    export const store = new Store<HistoryScreenState>({ open: false });

    /**
     * Toggle the open state of the history screen
     */
    export function toggleOpen() {
        store.setState((state) => ({ ...state, open: !state.open }));
    }

    /**
     * Set the open state of the history screen
     */
    export function setOpen(value: boolean) {
        store.setState((state) => ({ ...state, open: value }));
    }
}
