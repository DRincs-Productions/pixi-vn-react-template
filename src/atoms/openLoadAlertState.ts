import { atom } from "recoil";

export const openLoadAlertState = atom<boolean>({
    key: 'openLoadAlertState',
    default: false,
});
