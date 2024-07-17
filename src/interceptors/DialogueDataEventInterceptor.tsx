import { CharacterBaseModel, GameStepManager, getCharacterById, getChoiceMenuOptions, getDialogue } from '@drincs/pixi-vn';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { choiceMenuState } from '../atoms/choiceMenuState';
import { dialogDataState } from '../atoms/dialogDataState';
import { hideInterfaceState } from '../atoms/hideInterfaceState';
import { hideNextButtonState } from '../atoms/hideNextButtonState';
import { reloadInterfaceDataEventState } from '../atoms/reloadInterfaceDataEventState';

export default function DialogueDataEventInterceptor() {
    const reloadInterfaceDataEvent = useRecoilValue(reloadInterfaceDataEventState);
    const { t } = useTranslation(["translation"]);
    const hideInterface = useRecoilValue(hideInterfaceState)
    const hideNextButton = useSetRecoilState(hideNextButtonState)
    const [{ text, character }, setDialogData] = useRecoilState(dialogDataState)
    const [{ menu }, setMenu] = useRecoilState(choiceMenuState)

    useEffect(() => {
        let dial = getDialogue()
        let newText: string | undefined = dial?.text
        let newCharacter: CharacterBaseModel | undefined = undefined
        if (dial) {
            newCharacter = dial.character ? getCharacterById(dial.character) : undefined
            if (!newCharacter && dial.character) {
                newCharacter = new CharacterBaseModel(dial.character, { name: t(dial.character) })
            }
        }
        try {
            if (dial !== text || newCharacter !== character) {
                setDialogData({
                    text: newText,
                    character: newCharacter,
                    hidden: hideInterface || newText ? false : true,
                })
            }
        } catch (e) { }
        let m = getChoiceMenuOptions()
        setMenu({
            menu: m || [],
            hidden: hideInterface || !m || m.length == 0,
        })
    }, [reloadInterfaceDataEvent])

    useEffect(() => {
        hideNextButton(hideInterface || !(GameStepManager.canGoNext))
    }, [menu, hideInterface])

    useEffect(() => {
        setDialogData((prev) => {
            return {
                ...prev,
                hidden: hideInterface || (prev.text ? false : true),
            }
        })
        setMenu((prev) => {
            return {
                ...prev,
                hidden: hideInterface || prev.menu.length == 0,
            }
        })
    }, [hideInterface])

    return null
}
