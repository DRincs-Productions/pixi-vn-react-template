import { Store } from "@tanstack/store";

type InterfaceStoreState = {
    /**
     * Whether the interface is hidden
     */
    hidden: boolean;
};

export namespace InterfaceStore {
    export const store = new Store<InterfaceStoreState>({ hidden: false });

    /**
     * Toggle the interface visibility
     */
    export function toggleHidden() {
        store.setState((state) => ({ ...state, hidden: !state.hidden }));
    }

    /**
     * Set the interface visibility
     */
    export function setHidden(value: boolean) {
        store.setState((state) => ({ ...state, hidden: value }));
    }

    /**
     * Show the interface (set hidden to false)
     */
    export function show() {
        store.setState((state) => ({ ...state, hidden: false }));
    }
}
