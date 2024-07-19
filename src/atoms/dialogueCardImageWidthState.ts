import { atom, selector } from "recoil";

const dialogueCardImageWidthAtomState = atom<number>({
    key: 'dialogueCardImageWidthAtomState',
    default: localStorage.getItem("dialogue_card_image_width") ? parseInt(localStorage.getItem("dialogue_card_image_width") as string) : 16,
});

export const dialogueCardImageWidthState = selector<number>({
    key: 'dialogueCardImageWidthState',
    get: ({ get }) => {
        return get(dialogueCardImageWidthAtomState)
    },
    set: ({ set }, value) => {
        if (typeof value === "number") {
            let valueString = value.toString()
            localStorage.setItem("dialogue_card_image_width", valueString)
        }
        else {
            localStorage.removeItem("dialogue_card_image_width")
        }
        set(dialogueCardImageWidthAtomState, value)
    },
});
