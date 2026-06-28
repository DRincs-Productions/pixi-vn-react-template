import { Store } from "@tanstack/store";

export namespace AlertDialogState {
    export const store = new Store<{ count: number }>({ count: 0 });

    export function increment() {
        store.setState((state) => ({ count: state.count + 1 }));
    }

    export function decrement() {
        store.setState((state) => ({ count: Math.max(0, state.count - 1) }));
    }
}
