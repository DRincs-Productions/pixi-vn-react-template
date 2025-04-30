import { create } from "zustand";

type InterfaceStoreType = {
    /**
     * Whether the interface is hidden
     */
    hidden: boolean;
    /**
     * Toggle the interface visibility
     */
    editHidden: () => void;
    /**
     * Set the interface visibility
     */
    setHidden: (value: boolean) => void;
};

const useInterfaceStore = create<InterfaceStoreType>((set) => ({
    hidden: false,
    editHidden: () => {
        if (location.pathname === "/") {
            return;
        }
        set((state) => ({ hidden: !state.hidden }));
    },
    setHidden: (value: boolean) => {
        if (location.pathname === "/") {
            return;
        }
        set({ hidden: value });
    },
}));
export default useInterfaceStore;
