import { Store } from "@tanstack/store";

type NetworkStoreState = {
    /**
     * Whether the user is online or not
     */
    isOnline: boolean;
};

export const networkStore = new Store<NetworkStoreState>({ isOnline: navigator.onLine });

/**
 * Update the online status
 */
export function updateOnlineStatus() {
    networkStore.setState((state) => ({ ...state, isOnline: navigator.onLine }));
}
