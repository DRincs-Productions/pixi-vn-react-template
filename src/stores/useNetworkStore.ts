import { Store } from "@tanstack/store";

type NetworkState = {
    /**
     * Whether the user is online or not
     */
    isOnline: boolean;
};

export const networkStore = new Store<NetworkState>({ isOnline: navigator.onLine });

/**
 * Update the online status
 */
export const updateOnlineStatus = () =>
    networkStore.setState((state) => ({ ...state, isOnline: navigator.onLine }));
