import { atom } from "recoil";

export const openHistoryScreenState = atom<boolean>({
    key: 'openHistoryScreenState',
    default: false,
});
