import GameSaveMenu from "@/components/menus/save-menu";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGameProps } from "@/hooks/props-hooks";
import type { FileRouteTypes } from "@/routeTree.gen";
import { downloadGameSave, loadGameSaveFromFile } from "@/utils/save-utility";
import { useLocation } from "@tanstack/react-router";
import { Download, FolderOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function SaveLoadSettingsPage() {
    const { t } = useTranslation(["ui"]);
    const gameProps = useGameProps();
    const location = useLocation();

    const toolbar = (
        <TooltipProvider>
            <div className="flex items-center gap-1">
                <Tooltip>
                    <TooltipTrigger render={<span />}>
                        <Button
                            variant="ghost"
                            size="icon-lg"
                            onClick={() =>
                                loadGameSaveFromFile((err) => {
                                    if (err) {
                                        toast.error(t("allert_error_occurred"));
                                        return;
                                    }
                                    gameProps.invalidateInterfaceData();
                                    toast.success(t("success_load"));
                                })
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
            </div>
        </TooltipProvider>
    );

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="border-b p-4">{toolbar}</div>
            <GameSaveMenu />
        </div>
    );
}
