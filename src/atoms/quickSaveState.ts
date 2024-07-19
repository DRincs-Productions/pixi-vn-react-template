import { atom, selector } from "recoil";

const quickSaveAtomState = atom<string | null>({
    key: 'quickSaveAtomState',
    default: localStorage.getItem("quickSave"),
});

export const quickSaveState = selector<string | null>({
    key: 'quickSaveState',
    get: ({ get }) => {
        return get(quickSaveAtomState)
    },
    set: ({ set }, value) => {
        if (typeof value === "string") {
            localStorage.setItem("quickSave", value)
        }
        else {
            localStorage.removeItem("quickSave")
        }
        set(quickSaveAtomState, value)
    },
});
