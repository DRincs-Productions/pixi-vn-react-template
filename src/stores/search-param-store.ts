import { Store } from "@tanstack/store";

export namespace SearchParams {
    export const store = new Store<Record<string, unknown>>({});

    /**
     * Set the value of a URL search param in the store.
     * Pass `undefined` to clear the param.
     */
    export function set(field: string, value: unknown) {
        store.setState((state) => ({ ...state, [field]: value }));
    }
}
