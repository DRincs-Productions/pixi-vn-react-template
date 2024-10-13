import { atom } from "recoil";
import GameSaveData from "../models/GameSaveData";

export const saveLoadAlertState = atom<{
    open: false;
    data?: any;
    type?: string;
    deafultName?: string;
} | {
    open: true;
    data: GameSaveData & { id: number };
    type: 'load';
} | {
    open: true;
    data: number;
    type: 'overwrite_save' | 'save';
    deafultName: string;
} | {
    open: true;
    data: number;
    type: 'delete';
}
>({
    key: 'saveLoadAlertState',
    default: { open: false },
});
