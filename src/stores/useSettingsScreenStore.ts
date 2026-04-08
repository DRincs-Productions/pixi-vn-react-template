import { create } from "zustand";

type SettingsScreenType = {
    /**
     * Whether the screen is open
     */
    open: boolean;
    /**
     * Open the screen
     */
    toggleOpen: () => void;
    /**
     * Set the open state of the screen
     */
    setOpen: (value: boolean) => void;
};

const useSettingsScreenStore = create<SettingsScreenType>((set) => ({
    open: false,
    toggleOpen: () => set((state) => ({ open: !state.open })),
    setOpen: (value: boolean) => set({ open: value }),
}));
export default useSettingsScreenStore;
