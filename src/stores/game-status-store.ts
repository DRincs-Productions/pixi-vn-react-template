import { Store } from "@tanstack/store";

type GameStatusStore = {
    /**
     * If the step is loading
     */
    loading: boolean;
};

export namespace GameStatus {
    export const store = new Store<GameStatusStore>({ loading: false });

    /**
     * Set the loading state of the step
     */
    export function setLoading(value: boolean) {
        store.setState((state) => ({ ...state, loading: value }));
    }
}
