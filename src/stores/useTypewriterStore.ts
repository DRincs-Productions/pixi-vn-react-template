import { Store } from "@tanstack/store";

type TypewriterStoreState = {
    /**
     * The delay in milliseconds between each character
     */
    delay: number;
    /**
     * Whether the typewriter effect is in progress
     */
    inProgress: boolean;
};

export const typewriterStore = new Store<TypewriterStoreState>({
    delay:
        typeof localStorage.getItem("typewriter_delay_millisecond") === "number"
            ? parseInt(localStorage.getItem("typewriter_delay_millisecond")!)
            : 10,
    inProgress: false,
});

/**
 * Set the delay in milliseconds between each character
 */
export function setTypewriterDelay(value: number) {
    if (typeof value === "number") {
        localStorage.setItem("typewriter_delay_millisecond", value.toString());
        typewriterStore.setState((state) => ({ ...state, delay: value }));
    }
}

/**
 * Start the typewriter effect
 */
export function startTypewriter() {
    typewriterStore.setState((state) => ({ ...state, inProgress: true }));
}

/**
 * End the typewriter effect
 */
export function endTypewriter() {
    typewriterStore.setState((state) => ({ ...state, inProgress: false }));
}
