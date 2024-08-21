import { ChoiceMenuOptionsType, getChoiceMenuOptions } from "@drincs/pixi-vn";
import { selector } from "recoil";
import { hideInterfaceState } from "./hideInterfaceState";
import { reloadInterfaceDataEventAtom } from "./reloadInterfaceDataEventAtom";

type ChoiceMenu = {
    menu: ChoiceMenuOptionsType,
    hidden: boolean,
}

export const choiceMenuState = selector<ChoiceMenu>({
    key: 'choiceMenuState',
    get: ({ get }) => {
        // dipendencies: when the dipendencies change, the selector will re-run
        get(reloadInterfaceDataEventAtom)
        let hideInterface = get(hideInterfaceState)

        let choiceMenu = getChoiceMenuOptions() || []
        return {
            menu: choiceMenu,
            hidden: hideInterface || !choiceMenu || choiceMenu.length == 0
        }
    },
});
