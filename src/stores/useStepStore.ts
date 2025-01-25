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
};

const useStepStore = create<StepStoreType>((set) => ({
    loading: false,
    setLoading: (value: boolean) => {
        set({ loading: value });
    },
}));
export default useStepStore;
