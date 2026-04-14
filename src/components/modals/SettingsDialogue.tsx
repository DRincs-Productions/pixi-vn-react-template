import { useHotkeys } from "@tanstack/react-hotkeys";
import { useTranslation } from "react-i18next";
import Settings from "@/components/menus/settings";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useSearchParamState, useSetSearchParamState } from "@/hooks/useSearchParamState";
import { cn } from "@/lib/utils";

export default function SettingsDialogue() {
    const open = useSearchParamState<boolean>("settings");
    const setOpen = useSetSearchParamState<boolean>("settings");
    const { t } = useTranslation(["ui"]);

    useHotkeys([
        {
            hotkey: "Escape",
            callback: () => setOpen(!open),
        },
    ]);

    return (
        <Dialog open={open ?? false} onOpenChange={(isOpen) => setOpen(isOpen || undefined)}>
            <DialogContent
                className={cn(
                    "flex flex-col p-0 gap-0 overflow-hidden",
                    "top-0 left-0 h-full max-h-full w-full max-w-full sm:max-w-full translate-x-0 translate-y-0 rounded-none",
                )}
            >
                {/* Header: title + toolbar. pr-12 leaves room for the close button (absolute top-2 right-2) */}
                <div className="flex shrink-0 items-center justify-between border-b px-4 py-2 pr-12">
                    <DialogTitle>{`${t("settings")}`}</DialogTitle>
                </div>
                {/* Body: flex-1 fills remaining height; flex col + overflow-hidden propagates max-height constraint to children */}
                <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
                    <Settings />
                </div>
            </DialogContent>
        </Dialog>
    );
}
