import { atom } from "recoil";

export const reloadInterfaceDataEventAtom = atom<number>({
    key: 'reloadInterfaceDataEventAtom',
    default: 0,
});
