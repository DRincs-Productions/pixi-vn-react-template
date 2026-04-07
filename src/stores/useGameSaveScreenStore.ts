import { Store } from "@tanstack/store";
import GameSaveData from "../models/GameSaveData";

type AlertState =
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

type GameSaveScreenState = {
    /**
     * Whether the save screen is open
     */
    open: boolean;
    /**
     * The current page of the save screen
     */
    page: number;
    alert: AlertState;
};

export const gameSaveScreenStore = new Store<GameSaveScreenState>({
    page: localStorage.getItem("save_screen_page") ? parseInt(localStorage.getItem("save_screen_page") as string) : 0,
    open: false,
    alert: { open: false },
});

/**
 * Set the page of the save screen
 */
export const setPage = (value: number) => {
    localStorage.setItem("save_screen_page", value.toString());
    gameSaveScreenStore.setState((state) => ({ ...state, page: value }));
};

/**
 * Toggle the save screen open state
 */
export const editOpen = () =>
    gameSaveScreenStore.setState((state) => ({ ...state, open: !state.open }));

/**
 * Set the open state of the save screen
 */
export const setOpen = (value: boolean) =>
    gameSaveScreenStore.setState((state) => ({ ...state, open: value }));

/**
 * Open the load alert
 */
export const editLoadAlert = (data: GameSaveData & { id: number }) =>
    gameSaveScreenStore.setState((state) => {
        if (state.alert.open) return { ...state, alert: { open: false } };
        return { ...state, alert: { open: true, data, type: "load" } };
    });

/**
 * Open the save alert
 */
export const editSaveAlert = (data: number, deafultName?: string) =>
    gameSaveScreenStore.setState((state) => {
        if (state.alert.open) return { ...state, alert: { open: false } };
        return { ...state, alert: { open: true, data, type: "save", deafultName: deafultName || "" } };
    });

/**
 * Open the overwrite save alert
 */
export const editOverwriteSaveAlert = (data: number, deafultName: string) =>
    gameSaveScreenStore.setState((state) => {
        if (state.alert.open) return { ...state, alert: { open: false } };
        return { ...state, alert: { open: true, data, type: "overwrite_save", deafultName } };
    });

/**
 * Open the delete alert
 */
export const editDeleteAlert = (data: number) =>
    gameSaveScreenStore.setState((state) => {
        if (state.alert.open) return { ...state, alert: { open: false } };
        return { ...state, alert: { open: true, data, type: "delete" } };
    });

/**
 * Close the alert
 */
export const closeAlert = () =>
    gameSaveScreenStore.setState((state) => ({ ...state, alert: { open: false } }));
