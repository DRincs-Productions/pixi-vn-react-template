import { create } from 'zustand';

type InterfaceStoreType = {
    /**
     * Whether the interface is hidden
     */
    hidden: boolean,
    /**
     * Toggle the interface visibility
     */
    editHidden: () => void,
    /**
     * Set the interface visibility
     */
    setHidden: (value: boolean) => void,
}

const useInterfaceStore = create<InterfaceStoreType>((set) => ({
    hidden: false,
    editHidden: () => {
        if (location.pathname === '/') {
            console.log("Can't hide interface on home page")
            return
        }
        set((state) => ({ hidden: !state.hidden }))
    },
    setHidden: (value: boolean) => {
        if (location.pathname === '/') {
            console.log("Can't hide interface on home page")
            return
        }
        set({ hidden: value })
    },
}))
export default useInterfaceStore;
