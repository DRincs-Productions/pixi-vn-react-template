import { Store } from "@tanstack/store";

type DialogueCardSettingsState = {
    /**
     * Height of the dialogue card
     */
    height: number;
    /**
     * Width of the image in the dialogue card
     */
    imageWidth: number;
};

export namespace DialogueCardSettings {
    export const store = new Store<DialogueCardSettingsState>({
        height: Number(localStorage.getItem("dialogue_card_height") ?? 30),
        imageWidth: Number(localStorage.getItem("dialogue_card_image_width") ?? 16),
    });

    /**
     * Set the height of the dialogue card
     */
    export function setHeight(value: number) {
        localStorage.setItem("dialogue_card_height", value.toString());
        store.setState((state) => ({ ...state, height: value }));
    }

    /**
     * Set the width of the image in the dialogue card
     */
    export function setImageWidth(value: number) {
        localStorage.setItem("dialogue_card_image_width", value.toString());
        store.setState((state) => ({ ...state, imageWidth: value }));
    }
}
