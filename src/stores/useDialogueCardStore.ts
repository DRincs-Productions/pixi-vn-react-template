import { create } from "zustand";

type DialogueCardStoreType = {
    /**
     * Height of the dialogue card
     */
    height: number;
    /**
     * Set the height of the dialogue card
     */
    setHeight: (value: number) => void;
    /**
     * Width of the image in the dialogue card
     */
    imageWidth: number;
    /**
     * Set the width of the image in the dialogue card
     */
    setImageWidth: (value: number) => void;
};

const useDialogueCardStore = create<DialogueCardStoreType>((set) => ({
    height: localStorage.getItem("dialogue_card_height") ? parseInt(localStorage.getItem("dialogue_card_height")!) : 30,
    setHeight: (value: number) => {
        localStorage.setItem("dialogue_card_height", value.toString());
        set({ height: value });
    },
    imageWidth: localStorage.getItem("dialogue_card_image_width")
        ? parseInt(localStorage.getItem("dialogue_card_image_width")!)
        : 16,
    setImageWidth: (value: number) => {
        localStorage.setItem("dialogue_card_image_width", value.toString());
        set({ imageWidth: value });
    },
}));
export default useDialogueCardStore;
