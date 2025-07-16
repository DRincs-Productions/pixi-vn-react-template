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
    /**
     * Set the interface visibility to true
     */
    show: () => void;
};

const useInterfaceStore = create<InterfaceStoreType>((set) => ({
    hidden: false,
    editHidden: () => set((state) => ({ hidden: !state.hidden })),
    setHidden: (value: boolean) => set({ hidden: value }),
    show: () => set(() => ({ hidden: false })),
}));
export default useInterfaceStore;
