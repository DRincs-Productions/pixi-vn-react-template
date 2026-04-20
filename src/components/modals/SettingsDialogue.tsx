import { useHotkeys } from "@tanstack/react-hotkeys";
import { useTranslation } from "react-i18next";
import Settings from "@/components/menus/settings";
import { Dialog, FullscreenDialogContent } from "@/components/ui/fullscreen-dialog";
import { useSearchParamState, useSetSearchParamState } from "@/hooks/useSearchParamState";

export default function SettingsDialogue() {
    const open = useSearchParamState<boolean>("settings");
    const setOpen = useSetSearchParamState<boolean>("settings");
    const { t } = useTranslation(["ui"]);

    useHotkeys([
        {
            hotkey: "Escape",
            callback: () => setOpen(!open),
            options: {
                meta: {
                    name: t("settings"),
                    description: t("settings_toggle_hotkey_description"),
                },
            },
        },
    ]);

    return (
        <Dialog open={open ?? false} onOpenChange={(isOpen) => setOpen(isOpen || undefined)}>
            <FullscreenDialogContent title={t("settings")}>
                <Settings />
            </FullscreenDialogContent>
        </Dialog>
    );
}
