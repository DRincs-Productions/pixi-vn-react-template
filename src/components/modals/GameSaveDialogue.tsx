import { useLocation, useNavigate } from "@tanstack/react-router";
import { Download, FolderOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import GameSaveMenu from "@/components/menus/save-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useGameProps from "@/hooks/useGameProps";
import { useSearchParamState, useSetSearchParamState } from "@/hooks/useSearchParamState";
import { cn } from "@/lib/utils";
import type { FileRouteTypes } from "@/routeTree.gen";
import { downloadGameSave, loadGameSaveFromFile } from "@/utils/save-utility";

export default function GameSaveDialogue() {
    const open = useSearchParamState<boolean>("saves");
    const setOpen = useSetSearchParamState<boolean>("saves");
    const { t } = useTranslation(["ui"]);
    const navigate = useNavigate();
    const gameProps = useGameProps();
    const location = useLocation();

    return (
        <Dialog open={open ?? false} onOpenChange={(isOpen) => setOpen(isOpen || undefined)}>
            <DialogContent
                className={cn(
                    "flex flex-col p-0 gap-0 overflow-hidden",
                    "top-0 left-0 h-full max-h-full w-full max-w-full sm:max-w-full translate-x-0 translate-y-0 rounded-none",
                    // lg+: large centered dialog (restore translate + rounded overridden by mobile classes)
                    "lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-xl lg:h-auto lg:w-[90vw] lg:max-h-[90vh] lg:max-w-5xl",
                )}
            >
                {/* Header: title + toolbar. pr-12 leaves room for the close button (absolute top-2 right-2) */}
                <div className="flex shrink-0 items-center justify-between border-b px-4 py-2 pr-12">
                    <DialogTitle>{`${t("save")}/${t("load")}`}</DialogTitle>
                    <div className="flex items-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger render={<span />}>
                                    <Button
                                        variant="ghost"
                                        size="icon-lg"
                                        onClick={() =>
                                            loadGameSaveFromFile(
                                                (to) => navigate({ to }),
                                                (err) => {
                                                    if (err) {
                                                        toast.error(t("allert_error_occurred"));
                                                        return;
                                                    }
                                                    gameProps.invalidateInterfaceData();
                                                    toast.success(t("success_load"));
                                                    setOpen(undefined);
                                                },
                                            )
                                        }
                                        aria-label={t("load_from_file")}
                                    >
                                        <FolderOpen className="size-6" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{t("load_from_file")}</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger render={<span />}>
                                    <Button
                                        variant="ghost"
                                        size="icon-lg"
                                        onClick={() => downloadGameSave()}
                                        disabled={
                                            (location.pathname as FileRouteTypes["fullPaths"]) ===
                                            "/"
                                        }
                                        aria-label={t("save_to_file")}
                                    >
                                        <Download className="size-6" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{t("save_to_file")}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                {/* Body: flex-1 fills remaining height; flex col + overflow-hidden propagates max-height constraint to children */}
                <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
                    <GameSaveMenu />
                </div>
            </DialogContent>
        </Dialog>
    );
}
