import { Store } from "@tanstack/store";

type NetworkStoreState = {
    /**
     * Whether the app can actually reach the network.
     */
    isOnline: boolean;
    /**
     * True while a network reachability check is running.
     */
    isChecking: boolean;
    /**
     * Timestamp of last completed network check.
     */
    lastCheckedAt: number | null;
    /**
     * Incremental value used to request a new check from the detector hook.
     */
    checkRequestId: number;
};

export namespace NetworkStore {
    function getNavigatorOnlineStatus() {
        return typeof navigator !== "undefined" ? navigator.onLine : true;
    }

    export const store = new Store<NetworkStoreState>({
        isOnline: getNavigatorOnlineStatus(),
        isChecking: false,
        lastCheckedAt: null,
        checkRequestId: 0,
    });

    /**
     * Mark connection as not available and stop pending loading state.
     */
    export function markOffline() {
        store.setState((state) => ({
            ...state,
            isOnline: false,
            isChecking: false,
            lastCheckedAt: Date.now(),
        }));
    }

    /**
     * Mark that a reachability check has started.
     */
    export function markChecking() {
        store.setState((state) => ({ ...state, isChecking: true }));
    }

    /**
     * Finalize the result of a reachability check.
     */
    export function setNetworkReachability(isOnline: boolean) {
        store.setState((state) => ({
            ...state,
            isOnline,
            isChecking: false,
            lastCheckedAt: Date.now(),
        }));
    }

    /**
     * Ask the detector hook to perform a new network check.
     */
    export function requestCheck() {
        store.setState((state) => ({
            ...state,
            checkRequestId: state.checkRequestId + 1,
        }));
    }

    /**
     * Keep store aligned to browser-reported connectivity and trigger verification when possible.
     */
    export function syncWithNavigator() {
        if (!getNavigatorOnlineStatus()) {
            markOffline();
            return;
        }

        requestCheck();
    }
}
