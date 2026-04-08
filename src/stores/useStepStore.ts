import { Store } from "@tanstack/store";

type StepStoreState = {
    /**
     * If the step is loading
     */
    loading: boolean;
    /**
     * If the step is loading in the go back
     */
    backLoading: boolean;
};

export namespace StepStore {
    export const store = new Store<StepStoreState>({ loading: false, backLoading: false });

    /**
     * Set the loading state of the step
     */
    export function setLoading(value: boolean) {
        store.setState((state) => ({ ...state, loading: value }));
    }

    /**
     * Set the loading state of the step in the back
     */
    export function setBackLoading(value: boolean) {
        store.setState((state) => ({ ...state, backLoading: value }));
    }
}
