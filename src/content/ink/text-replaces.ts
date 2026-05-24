import { i18nInterpolation } from "@/lib/i18n";
import { RegisteredCharacters } from "@drincs/pixi-vn";
import { TextReplaces } from "@drincs/pixi-vn-ink";

TextReplaces.add(
    (key) => {
        return i18nInterpolation(RegisteredCharacters.get(key)?.name);
    },
    {
        name: "character name",
        validation: "characterId",
        type: "before-translation",
        description: "Replaces a character ID with the character's name in the game.",
    },
);

TextReplaces.add(
    () => {
        return i18nInterpolation("Stephanie");
    },
    {
        name: "steph_fullname",
        validation: /steph_fullname/,
        type: "before-translation",
        description:
            "Replaces the placeholder 'steph_fullname' with the full name of the character Stephanie.",
    },
);
