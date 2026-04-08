import { Store } from "@tanstack/store";

type AutoInfoStoreState = {
    /**
     * Whether auto forward is enabled
     */
    enabled: boolean;
    /**
     * Time in seconds to wait before auto forwarding
     */
    time: number;
};

export namespace AutoInfoStore {
    export const store = new Store<AutoInfoStoreState>({
        enabled: false,
        time: localStorage.getItem("auto_forward_second") ? parseInt(localStorage.getItem("auto_forward_second")!) : 1,
    });

    /**
     * Enable or disable auto forward
     */
    export function editEnabled() {
        store.setState((state) => ({ ...state, enabled: !state.enabled }));
    }

    /**
     * Set the time to wait before auto forwarding
     */
    export function setTime(value: number) {
        if (value) {
            localStorage.setItem("auto_forward_second", value.toString());
            store.setState((state) => ({ ...state, time: value }));
        }
    }
}
