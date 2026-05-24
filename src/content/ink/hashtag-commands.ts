import { RegisteredCharacters } from "@drincs/pixi-vn";
import { HashtagCommands } from "@drincs/pixi-vn-ink";
import zod from "zod";

HashtagCommands.add(
    async (script, { navigate }) => {
        await navigate({ to: script[1] });
        return true;
    },
    {
        name: "navigate",
        description: `Navigates to a specified route within the game.

\`\`\`ink
# navigate <route>
\`\`\``,
        validation: zod.tuple([zod.literal("navigate"), zod.string()]),
    },
);

HashtagCommands.add(
    async (script) => {
        const character = RegisteredCharacters.get(script[1]);
        if (character) {
            character.name = script[2];
        }
        return true;
    },
    {
        name: "character rename",
        description: `Renames a character in the game.

\`\`\`ink
# rename <characterId> <newName>
\`\`\``,
        validation: zod.tuple([zod.literal("rename"), zod.string(), zod.string()]),
    },
);
