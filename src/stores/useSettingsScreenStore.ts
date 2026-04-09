import { router } from "@/App";

type SettingsSearch = { settings?: true };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function navigateSettings(value: boolean) {
    router.navigate({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        search: ((prev: SettingsSearch): SettingsSearch => {
            if (!value) {
                const { settings: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, settings: true };
        }) as any,
    });
}

export namespace SettingsScreenStore {
    /**
     * Toggle the open state of the settings screen via the URL search param
     */
    export function toggleOpen() {
        const isOpen = (router.state.location.search as SettingsSearch).settings === true;
        navigateSettings(!isOpen);
    }

    /**
     * Set the open state of the settings screen via the URL search param
     */
    export function setOpen(value: boolean) {
        navigateSettings(value);
    }
}
