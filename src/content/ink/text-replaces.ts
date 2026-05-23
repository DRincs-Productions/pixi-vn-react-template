import { TextReplaces } from "@drincs/pixi-vn-ink";

TextReplaces.add(
    (key) => {
        return `{{${key}}}`;
    },
    {
        name: "default",
        validation: "all",
    },
);
