import { GameStepManager } from "@drincs/pixi-vn";
import { selector } from "recoil";
import { hideInterfaceState } from "./hideInterfaceState";
import { reloadInterfaceDataEventAtom } from "./reloadInterfaceDataEventAtom";

export const hideNextButtonState = selector<boolean>({
    key: 'hideNextButtonState',
    get: ({ get }) => {
        // dipendencies: when the dipendencies change, the selector will re-run
        let hideInterface = get(hideInterfaceState)
        get(reloadInterfaceDataEventAtom)

        return hideInterface || !(GameStepManager.canGoNext)
    },
});
