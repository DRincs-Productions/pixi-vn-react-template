import { Store } from "@tanstack/store";

type SaveMenuPaginationStorage = {
    /**
     * The current page of the save screen
     */
    page: number;
};

export namespace SaveMenuPagination {
    export const store = new Store<SaveMenuPaginationStorage>({
        page: localStorage.getItem("save_screen_page")
            ? parseInt(localStorage.getItem("save_screen_page") as string, 10)
            : 0,
    });

    /**
     * Set the page of the save screen
     */
    export function setPage(value: number) {
        localStorage.setItem("save_screen_page", value.toString());
        store.setState((state) => ({ ...state, page: value }));
    }
}
