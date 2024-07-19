import { atom, selector } from "recoil";

const dialogueCardHeightAtomState = atom<number>({
    key: 'dialogueCardHeightAtomState',
    default: localStorage.getItem("dialogue_card_height") ? parseInt(localStorage.getItem("dialogue_card_height") as string) : 30,
});

export const dialogueCardHeightState = selector<number>({
    key: 'dialogueCardHeightState',
    get: ({ get }) => {
        return get(dialogueCardHeightAtomState)
    },
    set: ({ set }, value) => {
        if (typeof value === "number") {
            let valueString = value.toString()
            localStorage.setItem("dialogue_card_height", valueString)
        }
        else {
            localStorage.removeItem("dialogue_card_height")
        }
        set(dialogueCardHeightAtomState, value)
    },
});
