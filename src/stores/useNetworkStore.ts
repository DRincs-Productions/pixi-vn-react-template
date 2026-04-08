import { Store } from "@tanstack/store";

type NetworkStoreState = {
    /**
     * Whether the user is online or not
     */
    isOnline: boolean;
};

export namespace NetworkStore {
    export const store = new Store<NetworkStoreState>({ isOnline: navigator.onLine });

    /**
     * Update the online status
     */
    export function updateOnlineStatus() {
        store.setState((state) => ({ ...state, isOnline: navigator.onLine }));
    }
}
