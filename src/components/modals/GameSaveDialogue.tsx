import { useTranslation } from "react-i18next";
import GameSaveMenu from "@/components/menus/save-menu";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { useSearchParamState, useSetSearchParamState } from "@/hooks/useSearchParamState";
import { cn } from "@/lib/utils";

export default function GameSaveDialogue() {
    const open = useSearchParamState<boolean>("saves");
    const setOpen = useSetSearchParamState<boolean>("saves");
    const { t } = useTranslation(["ui"]);

    return (
        <Dialog open={open ?? false} onOpenChange={(isOpen) => setOpen(isOpen || undefined)}>
            <DialogContent
                className={cn(
                    // Mobile: fullscreen, slide in from bottom
                    "top-0 left-0 h-full max-h-full w-full max-w-full",
                    "translate-x-0 translate-y-0 rounded-none overflow-auto",
                    "data-open:slide-in-from-bottom data-closed:slide-out-to-bottom",
                    // lg+: large centered dialog, zoom animation
                    "lg:top-1/2 lg:left-1/2 lg:h-[90vh] lg:w-[90vw] lg:max-h-[90vh] lg:max-w-5xl",
                    "lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-xl",
                    "lg:data-open:slide-in-from-bottom-0 lg:data-closed:slide-out-to-bottom-0",
                    "duration-300",
                )}
            >
                <DialogTitle className="sr-only">{`${t("save")}/${t("load")}`}</DialogTitle>
                <GameSaveMenu />
            </DialogContent>
        </Dialog>
    );
}
