import { atom, selector } from "recoil";

const quickSaveAtomState = atom<string | null>({
    key: 'quickSaveAtomState',
    default: localStorage.getItem("quick_save"),
});

export const quickSaveState = selector<string | null>({
    key: 'quickSaveState',
    get: ({ get }) => {
        return get(quickSaveAtomState)
    },
    set: ({ set }, value) => {
        if (typeof value === "string") {
            localStorage.setItem("quick_save", value)
        }
        else {
            localStorage.removeItem("quick_save")
        }
        set(quickSaveAtomState, value)
    },
});
