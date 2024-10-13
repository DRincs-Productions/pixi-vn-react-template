import { atom, selector } from "recoil";

const saveScreenPageAtomState = atom<number>({
    key: 'saveScreenPageAtomState',
    default: localStorage.getItem("save_screen_page") ? parseInt(localStorage.getItem("save_screen_page") as string) : 0,
});

export const saveScreenPageState = selector<number>({
    key: 'saveScreenPageState',
    get: ({ get }) => {
        return get(saveScreenPageAtomState)
    },
    set: ({ set }, value) => {
        if (typeof value === "number") {
            let valueString = value.toString()
            localStorage.setItem("save_screen_page", valueString)
        }
        else {
            localStorage.removeItem("save_screen_page")
        }
        set(saveScreenPageAtomState, value)
    },
});
