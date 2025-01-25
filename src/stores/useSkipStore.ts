import { create } from "zustand";

type SkipStoreType = {
    /**
     * Whether the skip is enabled
     */
    enabled: boolean;
    /**
     * Set the skip state
     */
    editEnabled: () => void;
    /**
     * Set the skip state
     */
    setEnabled: (value: boolean) => void;
};

const useSkipStore = create<SkipStoreType>((set) => ({
    enabled: false,
    editEnabled: () => {
        set((state) => ({ enabled: !state.enabled }));
    },
    setEnabled: (value: boolean) => {
        set({ enabled: value });
    },
}));
export default useSkipStore;
