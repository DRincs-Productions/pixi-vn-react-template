import { Store } from "@tanstack/store";

type AutoInfoState = {
    /**
     * Whether auto forward is enabled
     */
    enabled: boolean;
    /**
     * Time in seconds to wait before auto forwarding
     */
    time: number;
};

export const autoInfoStore = new Store<AutoInfoState>({
    enabled: false,
    time: localStorage.getItem("auto_forward_second") ? parseInt(localStorage.getItem("auto_forward_second")!) : 1,
});

/**
 * Enable or disable auto forward
 */
export const editEnabled = () =>
    autoInfoStore.setState((state) => ({ ...state, enabled: !state.enabled }));

/**
 * Set the time to wait before auto forwarding
 */
export const setTime = (value: number) => {
    if (value) {
        localStorage.setItem("auto_forward_second", value.toString());
        autoInfoStore.setState((state) => ({ ...state, time: value }));
    }
};
