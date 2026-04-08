import { Store } from "@tanstack/store";

type InterfaceStoreState = {
    /**
     * Whether the interface is hidden
     */
    hidden: boolean;
};

export const interfaceStore = new Store<InterfaceStoreState>({ hidden: false });

/**
 * Toggle the interface visibility
 */
export function toggleInterfaceHidden() {
    interfaceStore.setState((state) => ({ ...state, hidden: !state.hidden }));
}

/**
 * Set the interface visibility
 */
export function setInterfaceHidden(value: boolean) {
    interfaceStore.setState((state) => ({ ...state, hidden: value }));
}

/**
 * Set the interface visibility to true
 */
export function showInterface() {
    interfaceStore.setState((state) => ({ ...state, hidden: false }));
}
