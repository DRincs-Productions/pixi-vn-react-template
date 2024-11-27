import { getCharacterById } from '@drincs/pixi-vn';
import { importInkText, onInkHashtagScript, onInkTranslate, onReplaceTextAfterTranslation } from '@drincs/pixi-vn-ink';
import startLabel from '../ink_labels/start.ink?raw';

export async function importAllInkLabels() {
    await importInkText([startLabel])
}

export function initializeInk({ navigate, t }: {
    navigate: (path: string) => void
    t: (text: string) => string
}) {
    onInkHashtagScript((script, _convertListStringToObj) => {
        if (script.length === 2) {
            if (script[0] === "navigate") {
                navigate(script[1])
                return true
            }
        }
        if (script[0] === "rename" && script.length === 3) {
            let character = getCharacterById(script[1])
            if (character) {
                character.name = script[2]
            }
            return true
        }
        return false
    })
    onReplaceTextAfterTranslation((key) => {
        let character = getCharacterById(key)
        if (character) {
            return character.name
        }

        // if return undefined, the system will not replace the character id
        return undefined
    })
    onInkTranslate((text) => {
        return t(text)
    })
}
