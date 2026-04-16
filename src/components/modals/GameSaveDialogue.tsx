import { useLocation, useNavigate } from "@tanstack/react-router";
import { Download, FolderOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import GameSaveMenu from "@/components/menus/save-menu";
import { Button } from "@/components/ui/button";
import { Dialog, FullscreenDialogContent } from "@/components/ui/fullscreen-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useGameProps from "@/hooks/useGameProps";
import { useSearchParamState, useSetSearchParamState } from "@/hooks/useSearchParamState";
import type { FileRouteTypes } from "@/routeTree.gen";
import { downloadGameSave, loadGameSaveFromFile } from "@/utils/save-utility";

export default function GameSaveDialogue() {
    const open = useSearchParamState<boolean>("saves");
    const setOpen = useSetSearchParamState<boolean>("saves");
    const { t } = useTranslation(["ui"]);
    const navigate = useNavigate();
    const gameProps = useGameProps();
    const location = useLocation();

    const toolbar = (
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
                        disabled={(location.pathname as FileRouteTypes["fullPaths"]) === "/"}
                        aria-label={t("save_to_file")}
                    >
                        <Download className="size-6" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>{t("save_to_file")}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    return (
        <Dialog open={open ?? false} onOpenChange={(isOpen) => setOpen(isOpen || undefined)}>
            <FullscreenDialogContent title={`${t("save")}/${t("load")}`} toolbar={toolbar} centered>
                <GameSaveMenu />
            </FullscreenDialogContent>
        </Dialog>
    );
}
