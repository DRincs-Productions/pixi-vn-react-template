import { useHotkeys } from "@tanstack/react-hotkeys";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { Check, Search } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, FullscreenDialogContent } from "@/components/ui/fullscreen-dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryNarrativeHistory } from "@/hooks/useQueryInterface";
import { useSearchParamState, useSetSearchParamState } from "@/hooks/useSearchParamState";
import { cn } from "@/lib/utils";

function HistoryList({ searchString }: { searchString?: string }) {
    const { data = [] } = useQueryNarrativeHistory({ searchString });

    return (
        <div className="flex flex-col gap-3">
            {data.map((item, index) => {
                const key = `${item.character ?? "unknown"}-${item.text}-${index}`;
                return (
                    <article key={key} className="rounded-lg border bg-card/50 p-3">
                        <div className="flex gap-2">
                            <Avatar size="sm">
                                <AvatarImage src={item.icon} />
                                <AvatarFallback>
                                    {item.character?.slice(0, 1).toUpperCase() ?? "?"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                {item.character && (
                                    <p className="text-sm font-medium text-foreground">{item.character}</p>
                                )}
                                <Markdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    components={{
                                        p: ({ children, id }) => (
                                            <p key={id} className="m-0 text-sm text-foreground">
                                                {children}
                                            </p>
                                        ),
                                    }}
                                >
                                    {item.text}
                                </Markdown>
                            </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {item.choices?.map((choice) => {
                                const choiceKey = `${choice.text}-${choice.isResponse ? "1" : "0"}-${choice.hidden ? "1" : "0"}`;
                                if (choice.hidden) {
                                    return null;
                                }
                                if (choice.isResponse) {
                                    return (
                                        <span
                                            key={`choices-success-${choiceKey}`}
                                            className={cn(
                                                "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs",
                                                "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400",
                                            )}
                                        >
                                            {choice.text}
                                            <Check className="size-3" />
                                        </span>
                                    );
                                }
                                return (
                                    <span
                                        key={`choices-${choiceKey}`}
                                        className={cn(
                                            "inline-flex items-center rounded-md border px-2 py-1 text-xs",
                                            "border-primary/30 bg-primary/10 text-primary",
                                        )}
                                    >
                                        {choice.text}
                                    </span>
                                );
                            })}
                            {item.inputValue && (
                                <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs">
                                    {item.inputValue.toString()}
                                </span>
                            )}
                        </div>
                    </article>
                );
            })}
        </div>
    );
}

export default function HistoryScreen() {
    const open = useSearchParamState<boolean>("history");
    const setOpen = useSetSearchParamState<boolean>("history");
    const [searchString, setSearchString] = useState("");
    const [debouncedSearchString] = useDebouncedValue(searchString, { wait: 120 });
    const { t } = useTranslation(["ui"]);

    const toggleOpen = useCallback(() => {
        setOpen(open ? undefined : true);
    }, [open, setOpen]);

    useHotkeys([
        {
            hotkey: "Control+H",
            callback: toggleOpen,
        },
    ]);

    const toolbar = (
        <div className="relative w-60 max-w-[40vw]">
            <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                className="pl-8"
                placeholder={t("search")}
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                aria-label={t("search")}
            />
        </div>
    );

    return (
        <Dialog open={open ?? false} onOpenChange={(isOpen) => setOpen(isOpen || undefined)}>
            <FullscreenDialogContent title={t("history")} toolbar={toolbar} centered>
                <ScrollArea className="h-full">
                    <div className="p-4">
                        <HistoryList searchString={debouncedSearchString} />
                    </div>
                </ScrollArea>
            </FullscreenDialogContent>
        </Dialog>
    );
}
