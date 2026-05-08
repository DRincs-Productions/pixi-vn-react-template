import { Store } from "@tanstack/store";

type GameNavigationStore = {
    to: string | null;
    requestId: number;
    listenerRegistered: boolean;
};

export namespace GameNavigation {
    export const store = new Store<GameNavigationStore>({
        to: null,
        requestId: 0,
        listenerRegistered: false,
    });

    export function requestNavigation(to: string) {
        store.setState((state) => ({
            to,
            requestId: state.requestId + 1,
            listenerRegistered: state.listenerRegistered,
        }));
    }

    export function markListenerRegistered() {
        store.setState((state) => ({
            to: state.to,
            requestId: state.requestId,
            listenerRegistered: true,
        }));
    }

    export function clearNavigationByRequestId(requestId: number) {
        store.setState((state) => {
            if (state.requestId !== requestId) {
                return state;
            }

            return {
                to: null,
                requestId: state.requestId,
                listenerRegistered: state.listenerRegistered,
            };
        });
    }
}
