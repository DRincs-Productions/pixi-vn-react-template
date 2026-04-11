import { Download, FolderOpen } from "lucide-react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import SaveFile from "@/components/menus/save-menu/save-slots";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useGameProps from "@/hooks/useGameProps";
import { useSetSearchParamState } from "@/hooks/useSearchParamState";
import { GameSaveScreenStore } from "@/lib/stores/useGameSaveScreenStore";
import type { FileRouteTypes } from "@/routeTree.gen";
import { downloadGameSave, loadGameSaveFromFile } from "@/utils/save-utility";

const TOTAL_PAGES = 999;

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: (number | "ellipsis")[] = [1];
    if (current > 3) pages.push("ellipsis");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
    }
    if (current < total - 2) pages.push("ellipsis");
    pages.push(total);
    return pages;
}

export default function GameSaveMenu() {
    const setOpen = useSetSearchParamState<boolean>("saves");
    const navigate = useNavigate();
    const page = useStore(GameSaveScreenStore.store, (state) => state.page);
    const { t } = useTranslation(["ui"]);
    const gameProps = useGameProps();
    const location = useLocation();

    const currentPage = page + 1;
    const pageNumbers = getPageNumbers(currentPage, TOTAL_PAGES);

    return (
        <>
            <div className="absolute top-2.5 right-10 flex flex-row">
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
                                    (location.pathname as FileRouteTypes["fullPaths"]) === "/"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => {
                    const id = page * 6 + index;
                    return <SaveFile key={`SaveFile${id}`} saveId={id} />;
                })}
            </div>
            <Pagination className="absolute bottom-1.5 left-0 right-0">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) GameSaveScreenStore.setPage(page - 1);
                            }}
                            aria-disabled={currentPage === 1}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                    {pageNumbers.map((p, i) =>
                        p === "ellipsis" ? (
                            <PaginationItem key={`ellipsis-${i}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={p} className="hidden sm:list-item">
                                <PaginationLink
                                    isActive={p === currentPage}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        GameSaveScreenStore.setPage((p as number) - 1);
                                    }}
                                >
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        ),
                    )}
                    <PaginationItem>
                        <PaginationNext
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < TOTAL_PAGES)
                                    GameSaveScreenStore.setPage(page + 1);
                            }}
                            aria-disabled={currentPage === TOTAL_PAGES}
                            className={
                                currentPage === TOTAL_PAGES ? "pointer-events-none opacity-50" : ""
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </>
    );
}
