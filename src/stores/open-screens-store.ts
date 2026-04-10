import { Store } from "@tanstack/store";

type OpenScreensState = {
    /**
     * Whether the settings drawer is open.
     */
    settings: boolean;
    /**
     * Whether the save/load screen is open.
     */
    saves: boolean;
    /**
     * Whether the history screen is open.
     */
    history: boolean;
};

export namespace OpenScreens {
    export const store = new Store<OpenScreensState>({
        settings: false,
        saves: false,
        history: false,
    });

    export function setSettings(value: boolean) {
        store.setState((state) => ({ ...state, settings: value }));
    }

    export function setSaves(value: boolean) {
        store.setState((state) => ({ ...state, saves: value }));
    }

    export function setHistory(value: boolean) {
        store.setState((state) => ({ ...state, history: value }));
    }
}
