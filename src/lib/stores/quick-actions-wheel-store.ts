import { Store } from "@tanstack/store";

export namespace QuickActionsWheelState {
    export const store = new Store<{
        open: boolean;
    }>({
        open: false,
    });

    export function setOpen(value: boolean) {
        store.setState((state) => ({ ...state, open: value }));
    }

    export function toggleOpen() {
        store.setState((state) => ({ ...state, open: !state.open }));
    }
}
