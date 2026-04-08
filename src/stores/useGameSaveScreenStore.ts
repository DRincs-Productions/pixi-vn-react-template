import { Store } from "@tanstack/store";
import type GameSaveData from "../models/GameSaveData";

type GameSaveScreenAlert =
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

type GameSaveScreenStoreState = {
    /**
     * Whether the save screen is open
     */
    open: boolean;
    /**
     * The current page of the save screen
     */
    page: number;
    alert: GameSaveScreenAlert;
};

export const gameSaveScreenStore = new Store<GameSaveScreenStoreState>({
    page: localStorage.getItem("save_screen_page") ? parseInt(localStorage.getItem("save_screen_page") as string) : 0,
    open: false,
    alert: { open: false },
});

/**
 * Toggle the open state of the save screen
 */
export function toggleGameSaveScreenOpen() {
    gameSaveScreenStore.setState((state) => ({ ...state, open: !state.open }));
}

/**
 * Set the open state of the save screen
 */
export function setGameSaveScreenOpen(value: boolean) {
    gameSaveScreenStore.setState((state) => ({ ...state, open: value }));
}

/**
 * Set the page of the save screen
 */
export function setGameSaveScreenPage(value: number) {
    localStorage.setItem("save_screen_page", value.toString());
    gameSaveScreenStore.setState((state) => ({ ...state, page: value }));
}

/**
 * Open the load alert
 */
export function editLoadAlert(data: GameSaveData & { id: number }) {
    gameSaveScreenStore.setState((state) => {
        if (state.alert.open) {
            return { ...state, alert: { open: false } };
        }
        return { ...state, alert: { open: true, data, type: "load" } };
    });
}

/**
 * Open the save alert
 */
export function editSaveAlert(data: number, deafultName?: string) {
    gameSaveScreenStore.setState((state) => {
        if (state.alert.open) {
            return { ...state, alert: { open: false } };
        }
        return { ...state, alert: { open: true, data, type: "save", deafultName: deafultName || "" } };
    });
}

/**
 * Open the overwrite save alert
 */
export function editOverwriteSaveAlert(data: number, deafultName: string) {
    gameSaveScreenStore.setState((state) => {
        if (state.alert.open) {
            return { ...state, alert: { open: false } };
        }
        return { ...state, alert: { open: true, data, type: "overwrite_save", deafultName } };
    });
}

/**
 * Open the delete alert
 */
export function editDeleteAlert(data: number) {
    gameSaveScreenStore.setState((state) => {
        if (state.alert.open) {
            return { ...state, alert: { open: false } };
        }
        return { ...state, alert: { open: true, data, type: "delete" } };
    });
}

/**
 * Close the alert
 */
export function closeGameSaveAlert() {
    gameSaveScreenStore.setState((state) => ({ ...state, alert: { open: false } }));
}
