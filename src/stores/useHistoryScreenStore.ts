import { create } from "zustand";

type HistoryScreenType = {
    /**
     * Whether the screen is open
     */
    open: boolean;
    /**
     * Open the screen
     */
    editOpen: () => void;
    /**
     * Set the open state of the screen
     */
    setOpen: (value: boolean) => void;
};

const useHistoryScreenStore = create<HistoryScreenType>((set) => ({
    open: false,
    editOpen: () => set((state) => ({ open: !state.open })),
    setOpen: (value: boolean) => set({ open: value }),
}));
export default useHistoryScreenStore;
