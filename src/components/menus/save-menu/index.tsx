import { useStore } from "@tanstack/react-store";
import SavSlot from "@/components/menus/save-menu/save-slots";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { GameSaveScreenStore } from "@/lib/stores/useGameSaveScreenStore";

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
    const page = useStore(GameSaveScreenStore.store, (state) => state.page);

    const currentPage = page + 1;
    const pageNumbers = getPageNumbers(currentPage, TOTAL_PAGES);

    return (
        <div className="flex h-full flex-col">
            <div className="min-h-0 flex-1 overflow-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => {
                        const id = page * 6 + index;
                        return <SavSlot key={`SaveFile${id}`} saveId={id} />;
                    })}
                </div>
            </div>
            <Pagination className="shrink-0 border-t py-1.5">
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
        </div>
    );
}
