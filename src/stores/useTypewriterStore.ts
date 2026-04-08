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

export namespace TypewriterStore {
    export const store = new Store<TypewriterStoreState>({
        delay:
            typeof localStorage.getItem("typewriter_delay_millisecond") === "number"
                ? parseInt(localStorage.getItem("typewriter_delay_millisecond")!)
                : 10,
        inProgress: false,
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
