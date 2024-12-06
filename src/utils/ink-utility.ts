import { getCharacterById } from '@drincs/pixi-vn';
import { importInkText, onInkHashtagScript, onInkTranslate, onReplaceTextAfterTranslation } from '@drincs/pixi-vn-ink';

export async function importAllInkLabels() {
    const files = import.meta.glob<{ default: string }>('../ink_labels/*.{ink,txt}');
    const fileEntries = await Promise.all(
        Object.entries(files).map(async ([path]) => {
            const fileModule = await import(path + "?raw");
            return fileModule.default;
        })
    );
    await importInkText(fileEntries)
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
