import { create } from "zustand";

type NetworkStoreType = {
    /**
     * Whether the user is online or not
     */
    isOnline: boolean;
    /**
     * Update the online status
     */
    updateOnlineStatus: () => void;
};

const useNetworkStore = create<NetworkStoreType>((set) => ({
    isOnline: navigator.onLine,
    updateOnlineStatus: () => {
        set({ isOnline: navigator.onLine });
    },
}));
export default useNetworkStore;
