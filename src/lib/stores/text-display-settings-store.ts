import { Store } from "@tanstack/store";

type TextDisplayStorage = {
    /**
     * The delay in milliseconds between each character
     */
    delay: number;
    /**
     * Whether the typewriter effect is in progress
     */
    inProgress: boolean;
    /**
     * The font size in percent (100 = default)
     */
    fontSize: number;
};

export namespace TextDisplaySettings {
    export const store = new Store<TextDisplayStorage>({
        delay: Number(localStorage.getItem("typewriter_delay_millisecond") ?? 10),
        inProgress: false,
        fontSize: Number(localStorage.getItem("text_display_font_size") ?? 100),
    });

    /**
     * Set the delay in milliseconds between each character
     */
    export function setDelay(value: number) {
        if (typeof value === "number") {
            localStorage.setItem("typewriter_delay_millisecond", value.toString());
            store.setState((state) => ({ ...state, delay: value }));
        }
    }

    /**
     * Set the font size in percent
     */
    export function setFontSize(value: number) {
        if (typeof value === "number") {
            localStorage.setItem("text_display_font_size", value.toString());
            store.setState((state) => ({ ...state, fontSize: value }));
        }
    }

    /**
     * Start the typewriter effect
     */
    export function start() {
        store.setState((state) => ({ ...state, inProgress: true }));
    }

    /**
     * End the typewriter effect
     */
    export function end() {
        store.setState((state) => ({ ...state, inProgress: false }));
    }
}
