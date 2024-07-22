import { CharacterBaseModel, getCharacterById, getDialogue } from '@drincs/pixi-vn';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { autoInfoState } from '../atoms/autoInfoState';
import { dialogDataState } from '../atoms/dialogDataState';
import { hideInterfaceState } from '../atoms/hideInterfaceState';
import { reloadInterfaceDataEventState } from '../atoms/reloadInterfaceDataEventState';

export default function DialogueDataEventInterceptor() {
    const reloadInterfaceDataEvent = useRecoilValue(reloadInterfaceDataEventState);
    const { t } = useTranslation(["translation"]);
    const hideInterface = useRecoilValue(hideInterfaceState)
    const updateAuto = useSetRecoilState(autoInfoState)
    const [{ text, character }, setDialogData] = useRecoilState(dialogDataState)

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
            if (dial?.text !== text || newCharacter !== character) {
                setDialogData({
                    text: newText,
                    character: newCharacter,
                    hidden: hideInterface || newText ? false : true,
                })
            }
            else {
                updateAuto((prev) => {
                    return {
                        ...prev,
                        update: prev.update + 1
                    }
                })
            }
        } catch (e) { }
    }, [reloadInterfaceDataEvent])

    return null
}
