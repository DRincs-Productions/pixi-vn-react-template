import { Store } from "@tanstack/store";

type AutoSettingsState = {
    /**
     * Whether auto forward is enabled
     */
    enabled: boolean;
    /**
     * Time in seconds to wait before auto forwarding
     */
    time: number;
};

export namespace AutoSettings {
    export const store = new Store<AutoSettingsState>({
        enabled: Boolean(localStorage.getItem("auto_forward_enabled") ?? false),
        time: Number(localStorage.getItem("auto_forward_second") ?? 1),
    });

    /**
     * Toggle the auto forward state
     */
    export function toggleEnabled() {
        store.setState((state) => {
            localStorage.setItem("auto_forward_enabled", (!state.enabled).toString());
            return { ...state, enabled: !state.enabled };
        });
    }

    /**
     * Set the time to wait before auto forwarding
     */
    export function setTime(value: number) {
        localStorage.setItem("auto_forward_second", value.toString());
        store.setState((state) => ({ ...state, time: value }));
    }
}
