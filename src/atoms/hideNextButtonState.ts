import { atom } from "recoil";

export const hideNextButtonState = atom<boolean>({
    key: 'hideNextButtonState',
    default: false,
});
