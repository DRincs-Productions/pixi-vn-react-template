import { Store } from "@tanstack/store";

type InterfaceStoreState = {
    /**
     * Whether the interface is hidden
     */
    hidden: boolean;
    /**
     * Height of the dialogue card as percentage (0-100)
     */
    dialogueCardHeight: number;
    /**
     * Width of the dialogue image as percentage (0-100)
     */
    dialogueCardImageWidth: number;
};

function parseIntOrDefault(key: string, fallback: number) {
    const raw = localStorage.getItem(key);
    const n = Number.parseInt(raw ?? String(fallback), 10);
    return Number.isFinite(n) ? n : fallback;
}

export namespace InterfaceStore {
    export const store = new Store<InterfaceStoreState>({
        hidden: false,
        dialogueCardHeight: parseIntOrDefault("dialogue_card_height", 30),
        dialogueCardImageWidth: parseIntOrDefault("dialogue_card_image_width", 16),
    });

    /**
     * Toggle the interface visibility
     */
    export function toggleHidden() {
        store.setState((state) => ({ ...state, hidden: !state.hidden }));
    }

    /**
     * Set the interface visibility
     */
    export function setHidden(value: boolean) {
        store.setState((state) => ({ ...state, hidden: value }));
    }

    /**
     * Show the interface (set hidden to false)
     */
    export function show() {
        store.setState((state) => ({ ...state, hidden: false }));
    }

    /**
     * Set the dialogue card height and persist
     */
    export function setDialogueCardHeight(value: number) {
        localStorage.setItem("dialogue_card_height", value.toString());
        store.setState((state) => ({ ...state, dialogueCardHeight: value }));
    }

    /**
     * Set the dialogue image width and persist
     */
    export function setDialogueCardImageWidth(value: number) {
        localStorage.setItem("dialogue_card_image_width", value.toString());
        store.setState((state) => ({ ...state, dialogueCardImageWidth: value }));
    }
}
