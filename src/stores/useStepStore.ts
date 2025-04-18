import { create } from "zustand";

type StepStoreType = {
    /**
     * If the step is loading
     */
    loading: boolean;
    /**
     * Set the loading state of the step
     */
    setLoading: (value: boolean) => void;
    /**
     * If the step is loading in the go back
     */
    backLoading: boolean;
    /**
     * Set the loading state of the step in the back
     */
    setBackLoading: (value: boolean) => void;
};

const useStepStore = create<StepStoreType>((set) => ({
    loading: false,
    setLoading: (value: boolean) => {
        set({ loading: value });
    },
    backLoading: false,
    setBackLoading: (value: boolean) => {
        set({ backLoading: value });
    },
}));
export default useStepStore;
