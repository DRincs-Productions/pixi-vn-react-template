import { VariantType } from "notistack";

declare module "@drincs/pixi-vn/dist/override" {
    interface StepLabelResult {
        [key: string]: any;
    }
    interface StepLabelProps {
        /**
         * function to navigate to a new route.
         * @param route The route to navigate to.
         * @returns
         */
        navigate: (route: string) => void;
        /**
         * Translate a key to a string.
         * @param key The key to translate.
         * @returns The translated string.
         */
        t: TFunction<[string], undefined>;
        /**
         * Show a notification.
         * @param message The message to show.
         * @param variant The variant of the notification.
         * @returns
         */
        notify: (message: string, variant: VariantType) => void;
        [key: string]: any;
    }
    interface CharacterInterface {
        /**
         * The name of the character.
         * If you set undefined, it will return the default name.
         */
        name: string;
        /**
         * The surname of the character.
         * If you set undefined, it will return the default surname.
         */
        surname?: string;
        /**
         * The age of the character.
         * If you set undefined, it will return the default age.
         */
        age?: number;
        /**
         * The icon of the character.
         */
        readonly icon?: string;
        /**
         * The color of the character.
         */
        readonly color?: string;
    }
}
