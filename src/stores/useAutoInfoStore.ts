import { create } from "zustand";

type AutoInfoStoreType = {
    /**
     * Whether auto forward is enabled
     */
    enabled: boolean;
    /**
     * Time in seconds to wait before auto forwarding
     */
    time: number;
    /**
     * Enable or disable auto forward
     */
    editEnabled: () => void;
    /**
     * Set the time to wait before auto forwarding
     */
    setTime: (value: number) => void;
};

const useAutoInfoStore = create<AutoInfoStoreType>((set) => ({
    enabled: false,
    time: localStorage.getItem("auto_forward_second") ? parseInt(localStorage.getItem("auto_forward_second")!) : 1,
    editEnabled: () => set((state) => ({ enabled: !state.enabled })),
    setTime: (value: number) => {
        if (value) {
            localStorage.setItem("auto_forward_second", value.toString());
            set({ time: value });
        }
    },
}));
export default useAutoInfoStore;
