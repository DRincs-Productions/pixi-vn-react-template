import { RegisteredCharacters } from "@drincs/pixi-vn";
import { importInkText, onInkHashtagScript, onReplaceTextBeforeTranslation } from "@drincs/pixi-vn-ink";

export async function importAllInkLabels() {
    const files = import.meta.glob<{ default: string }>("../ink/*.{ink,txt}");
    const fileEntries = await Promise.all(
        Object.entries(files).map(async ([path]) => {
            const fileModule = await import(/* @vite-ignore */ path + "?raw");
            return fileModule.default;
        })
    );
    await importInkText(fileEntries);
}

export function initializeInk({ navigate }: { navigate: (path: string) => void }) {
    onInkHashtagScript((script, _convertListStringToObj) => {
        if (script.length === 2) {
            if (script[0] === "navigate") {
                navigate(script[1]);
                return true;
            }
        }
        if (script[0] === "rename" && script.length === 3) {
            let character = RegisteredCharacters.get(script[1]);
            if (character) {
                character.name = script[2];
            }
            return true;
        }
        return false;
    });
    onReplaceTextBeforeTranslation((key) => {
        return `{{${key}}}`;
    });
}
