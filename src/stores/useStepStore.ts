import { Store } from "@tanstack/store";

type StepState = {
    /**
     * If the step is loading
     */
    loading: boolean;
    /**
     * If the step is loading in the go back
     */
    backLoading: boolean;
};

export const stepStore = new Store<StepState>({ loading: false, backLoading: false });

/**
 * Set the loading state of the step
 */
export const setLoading = (value: boolean) =>
    stepStore.setState((state) => ({ ...state, loading: value }));

/**
 * Set the loading state of the step in the back
 */
export const setBackLoading = (value: boolean) =>
    stepStore.setState((state) => ({ ...state, backLoading: value }));
