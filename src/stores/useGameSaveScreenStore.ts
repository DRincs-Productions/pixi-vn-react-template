import { create } from "zustand";
import GameSaveData from "../models/GameSaveData";

type GameSaveScreenStoreType = {
    /**
     * Whether the save screen is open
     */
    open: boolean;
    /**
     * Open the save screen
     */
    editOpen: () => void;
    /**
     * Set the open state of the save screen
     */
    setOpen: (value: boolean) => void;
    /**
     * The current page of the save screen
     */
    page: number;
    /**
     * Set the page of the save screen
     */
    setPage: (value: number) => void;
    alert:
        | {
              open: false;
              data?: any;
              type?: string;
              deafultName?: string;
          }
        | {
              open: true;
              data: GameSaveData & { id: number };
              type: "load";
          }
        | {
              open: true;
              data: number;
              type: "overwrite_save" | "save";
              deafultName: string;
          }
        | {
              open: true;
              data: number;
              type: "delete";
          };
    /**
     * Open the load alert
     */
    editLoadAlert: (data: GameSaveData & { id: number }) => void;
    /**
     * Open the save alert
     */
    editSaveAlert: (data: number, deafultName?: string) => void;
    /**
     * Open the overwrite save alert
     */
    editOverwriteSaveAlert: (data: number, deafultName: string) => void;
    /**
     * Open the delete alert
     */
    editDeleteAlert: (data: number) => void;
    /**
     * Close the alert
     */
    closeAlert: () => void;
};

const useGameSaveScreenStore = create<GameSaveScreenStoreType>((set) => ({
    page: localStorage.getItem("save_screen_page") ? parseInt(localStorage.getItem("save_screen_page") as string) : 0,
    setPage: (value: number) => {
        localStorage.setItem("save_screen_page", value.toString());
        set({ page: value });
    },
    open: false,
    editOpen: () => set((state) => ({ open: !state.open })),
    setOpen: (value: boolean) => set({ open: value }),
    alert: {
        open: false,
    },
    editLoadAlert: (data: GameSaveData & { id: number }) =>
        set((state) => {
            if (state.alert.open) {
                return { alert: { open: false } };
            }
            return { alert: { open: true, data, type: "load" } };
        }),
    editSaveAlert: (data: number, deafultName?: string) =>
        set((state) => {
            if (state.alert.open) {
                return { alert: { open: false } };
            }
            return { alert: { open: true, data, type: "save", deafultName: deafultName || "" } };
        }),
    editOverwriteSaveAlert: (data: number, deafultName: string) =>
        set((state) => {
            if (state.alert.open) {
                return { alert: { open: false } };
            }
            return { alert: { open: true, data, type: "overwrite_save", deafultName } };
        }),
    editDeleteAlert: (data: number) =>
        set((state) => {
            if (state.alert.open) {
                return { alert: { open: false } };
            }
            return { alert: { open: true, data, type: "delete" } };
        }),
    closeAlert: () => set(() => ({ alert: { open: false } })),
}));
export default useGameSaveScreenStore;
