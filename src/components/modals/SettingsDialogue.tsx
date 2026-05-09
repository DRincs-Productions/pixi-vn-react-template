import Settings from "@/components/menus/settings";
import { Dialog, FullscreenDialogContent } from "@/components/ui/fullscreen-dialog";
import { useSearchParamState, useSetSearchParamState } from "@/hooks/useSearchParamState";
import { useTranslation } from "react-i18next";

export default function SettingsDialogue() {
    const open = useSearchParamState<boolean>("settings");
    const setOpen = useSetSearchParamState<boolean>("settings");
    const setSettingsTab = useSetSearchParamState<string>("settings_tab");
    const { t } = useTranslation(["ui"]);

    return (
        <Dialog
            open={open ?? false}
            onOpenChange={(isOpen) => {
                setOpen(isOpen || undefined);
                if (!isOpen) {
                    setSettingsTab(undefined);
                }
            }}
        >
            <FullscreenDialogContent title={t("settings")}>
                <Settings />
            </FullscreenDialogContent>
        </Dialog>
    );
}
