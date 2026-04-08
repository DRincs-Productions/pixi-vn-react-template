import { Store } from "@tanstack/store";

type GameStatusState = {
    /**
     * If the step is loading
     */
    loading: boolean;
};

export namespace GameStatus {
    export const store = new Store<GameStatusState>({ loading: false });

    /**
     * Set the loading state of the step
     */
    export function setLoading(value: boolean) {
        store.setState((state) => ({ ...state, loading: value }));
    }
}
