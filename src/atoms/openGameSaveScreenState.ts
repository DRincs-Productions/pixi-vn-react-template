import { atom } from "recoil";

export const openGameSaveScreenState = atom<boolean>({
    key: 'openGameSaveScreenState',
    default: false,
});
