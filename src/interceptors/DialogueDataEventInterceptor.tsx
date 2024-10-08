import { CharacterBaseModel, getCharacterById, narration } from '@drincs/pixi-vn';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { autoInfoState } from '../atoms/autoInfoState';
import { dialogDataState } from '../atoms/dialogDataState';
import { hideInterfaceState } from '../atoms/hideInterfaceState';
import { reloadInterfaceDataEventAtom } from '../atoms/reloadInterfaceDataEventAtom';

export default function DialogueDataEventInterceptor() {
    const reloadInterfaceDataEvent = useRecoilValue(reloadInterfaceDataEventAtom);
    const { t: tNarration } = useTranslation(["narration"]);
    const hideInterface = useRecoilValue(hideInterfaceState)
    const updateAuto = useSetRecoilState(autoInfoState)
    const [{ text, character }, setDialogData] = useRecoilState(dialogDataState)

    useEffect(() => {
        let dialogue = narration.dialogue
        let newText: string | undefined = dialogue?.text
        let newCharacter: CharacterBaseModel | undefined = undefined
        if (dialogue) {
            newCharacter = dialogue.character ? getCharacterById(dialogue.character) : undefined
            if (!newCharacter && dialogue.character) {
                newCharacter = new CharacterBaseModel(dialogue.character, { name: tNarration(dialogue.character) })
            }
        }
        try {
            if (dialogue?.text !== text || newCharacter !== character) {
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
