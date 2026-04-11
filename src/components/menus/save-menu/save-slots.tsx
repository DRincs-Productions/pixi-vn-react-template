import { useLocation } from "@tanstack/react-router";
import { ArchiveRestore, Download, Save, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import useSaveFileActions from "@/components/menus/save-menu/use-save-menu-actions";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useQuerySaves from "@/hooks/useQuerySaves";
import type { FileRouteTypes } from "@/routeTree.gen";
import { downloadGameSave } from "@/utils/save-utility";

const textShadow = "0 0 3px #111827, 0 0 5px #111827";

export default function SaveFile({ saveId }: { saveId: number }) {
    const { t } = useTranslation(["ui"]);
    const { isLoading, data: saveData, isError } = useQuerySaves({ id: saveId });
    const location = useLocation();
    const { handleLoad, handleDelete, handleSave } = useSaveFileActions();

    const isHome = (location.pathname as FileRouteTypes["fullPaths"]) === "/";

    if (isLoading) {
        return (
            <AspectRatio ratio={16 / 9} className="m-2 rounded-xl sm:m-4 md:m-2 lg:m-4">
                <Skeleton className="absolute inset-0 rounded-xl" />
            </AspectRatio>
        );
    }

    if (!saveData || isError) {
        return (
            <AspectRatio ratio={16 / 9} className="m-2 rounded-xl sm:m-4 md:m-2 lg:m-4">
                <Button
                    variant="ghost"
                    className="absolute inset-0 h-full w-full"
                    onClick={() => handleSave(saveId)}
                    disabled={isHome}
                    aria-label={t("save")}
                >
                    <Save className="size-12 opacity-20" />
                </Button>
            </AspectRatio>
        );
    }

    return (
        <AspectRatio ratio={16 / 9} className="m-2 overflow-hidden rounded-xl sm:m-4 md:m-2 lg:m-4">
            <img
                src={saveData.image}
                alt={saveData.name}
                className="absolute inset-0 size-full object-contain"
                style={{ backgroundColor: "#303030", pointerEvents: "none", userSelect: "none" }}
            />
            {/* top-left metadata */}
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-0.5 select-none pointer-events-none">
                <span className="text-base font-semibold text-neutral-300" style={{ textShadow }}>
                    {saveData.name}
                </span>
                <span className="text-sm text-neutral-300" style={{ textShadow }}>
                    {saveData.date.toLocaleDateString()}
                </span>
                <span className="text-sm text-neutral-300" style={{ textShadow }}>
                    {saveData.date.toLocaleTimeString()}
                </span>
                <span className="text-sm text-neutral-300" style={{ textShadow }}>
                    {`${t("save_slot")} ${String(saveId + 1).padStart(2, "0")}`}
                </span>
            </div>
            {/* top-right delete */}
            <div className="absolute top-2.5 right-2.5">
                <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(saveId)}
                    aria-label={t("delete")}
                >
                    <Trash2 />
                </Button>
            </div>
            {/* bottom-right actions */}
            <div className="absolute bottom-2.5 right-2.5 flex flex-row gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => downloadGameSave(saveData)}
                    aria-label={t("save_to_file")}
                >
                    <Download className="text-neutral-300" />
                </Button>
                {!isHome && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSave(saveId, saveData.name)}
                        aria-label={t("save")}
                    >
                        <Save className="text-neutral-300" />
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleLoad({ ...saveData, id: saveId })}
                    aria-label={t("load")}
                >
                    <ArchiveRestore className="text-neutral-300" />
                </Button>
            </div>
        </AspectRatio>
    );
}
