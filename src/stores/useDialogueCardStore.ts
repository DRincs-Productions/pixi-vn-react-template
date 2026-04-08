import { Store } from "@tanstack/store";

type DialogueCardStoreState = {
    /**
     * Height of the dialogue card
     */
    height: number;
    /**
     * Width of the image in the dialogue card
     */
    imageWidth: number;
};

export const dialogueCardStore = new Store<DialogueCardStoreState>({
    height: localStorage.getItem("dialogue_card_height") ? parseInt(localStorage.getItem("dialogue_card_height")!) : 30,
    imageWidth: localStorage.getItem("dialogue_card_image_width")
        ? parseInt(localStorage.getItem("dialogue_card_image_width")!)
        : 16,
});

/**
 * Set the height of the dialogue card
 */
export function setDialogueCardHeight(value: number) {
    localStorage.setItem("dialogue_card_height", value.toString());
    dialogueCardStore.setState((state) => ({ ...state, height: value }));
}

/**
 * Set the width of the image in the dialogue card
 */
export function setDialogueCardImageWidth(value: number) {
    localStorage.setItem("dialogue_card_image_width", value.toString());
    dialogueCardStore.setState((state) => ({ ...state, imageWidth: value }));
}
