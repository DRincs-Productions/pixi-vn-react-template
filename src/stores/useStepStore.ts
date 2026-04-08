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

export const stepStore = new Store<StepStoreState>({ loading: false, backLoading: false });

/**
 * Set the loading state of the step
 */
export function setStepLoading(value: boolean) {
    stepStore.setState((state) => ({ ...state, loading: value }));
}

/**
 * Set the loading state of the step in the back
 */
export function setStepBackLoading(value: boolean) {
    stepStore.setState((state) => ({ ...state, backLoading: value }));
}
