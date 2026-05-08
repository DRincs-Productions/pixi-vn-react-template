import { Store } from "@tanstack/store";

type GameNavigationStore = {
    to: string | null;
};

export namespace GameNavigation {
    export const store = new Store<GameNavigationStore>({ to: null });

    export function requestNavigation(to: string) {
        store.setState((state) => ({ ...state, to }));
    }

    export function clearNavigation() {
        store.setState((state) => ({ ...state, to: null }));
    }
}
