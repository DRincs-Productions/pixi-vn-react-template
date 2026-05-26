import { RegisteredCharacters } from "@drincs/pixi-vn";
import { TextReplaces } from "@drincs/pixi-vn-ink";

TextReplaces.add((key) => RegisteredCharacters.get(key)?.name, {
    name: "character name",
    validation: "characterId",
    type: "after-translation",
    i18nInterpolation: true,
    description: "Replaces a character ID with the character's name in the game.",
});

TextReplaces.add(() => "Stephanie", {
    name: "steph_fullname",
    validation: /steph_fullname/,
    type: "after-translation",
    i18nInterpolation: true,
    description:
        "Replaces the placeholder 'steph_fullname' with the full name of the character Stephanie.",
});
