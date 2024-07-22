import { CharacterBaseModel } from "@drincs/pixi-vn";
import { atom, selector } from "recoil";
import { hideInterfaceState } from "./hideInterfaceState";

const dialogDataAtomState = atom<{
    character?: CharacterBaseModel,
    text?: string,
}>({
    key: 'dialogDataAtomState',
    default: {
        character: undefined,
        text: undefined,
    },
})

export const dialogDataState = selector<{
    character?: CharacterBaseModel,
    text?: string,
    hidden: boolean,
}>({
    key: 'dialogDataState',
    get: ({ get }) => {
        // dipendencies: when the dipendencies change, the selector will re-run
        let hideInterface = get(hideInterfaceState)
        let dialogData = get(dialogDataAtomState)

        return {
            ...dialogData,
            hidden: hideInterface || (dialogData.text ? false : true)
        }
    },
    set: ({ set }, value) => {
        set(dialogDataAtomState, value)
    },
});
