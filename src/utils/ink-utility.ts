import { RegisteredCharacters } from "@drincs/pixi-vn";
import {
    convertInkText,
    importInkText,
    onInkHashtagScript,
    onInkTranslate,
    onReplaceTextBeforeTranslation,
} from "@drincs/pixi-vn-ink";

async function getInkText() {
    const files = import.meta.glob<string>("../ink/*.ink", { eager: true, import: "default" });
    return await Promise.all(
        Object.values(files).map(async (importFile) => {
            return importFile;
        })
    );
}

export async function importAllInkLabels() {
    let fileEntries = await getInkText();
    await importInkText(fileEntries);
}

export async function convertInkToJson() {
    let fileEntries = await getInkText();
    return await Promise.all(fileEntries.map((data) => convertInkText(data)));
}

export function initializeInk(options: { t: (key: string) => string }) {
    const { t } = options;
    onInkHashtagScript((script, props, _convertListStringToObj) => {
        if (script.length === 2) {
            if (script[0] === "navigate") {
                props.navigate(script[1]);
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
    onInkTranslate(t);
}
