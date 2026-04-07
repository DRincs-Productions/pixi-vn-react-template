import { Store } from "@tanstack/store";

type InterfaceState = {
    /**
     * Whether the interface is hidden
     */
    hidden: boolean;
};

export const interfaceStore = new Store<InterfaceState>({ hidden: false });

/**
 * Toggle the interface visibility
 */
export const editHidden = () =>
    interfaceStore.setState((state) => ({ ...state, hidden: !state.hidden }));

/**
 * Set the interface visibility
 */
export const setHidden = (value: boolean) =>
    interfaceStore.setState((state) => ({ ...state, hidden: value }));

/**
 * Set the interface visibility to true (show)
 */
export const show = () =>
    interfaceStore.setState((state) => ({ ...state, hidden: false }));
