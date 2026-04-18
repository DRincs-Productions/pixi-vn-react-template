import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, FullscreenDialogContent } from "@/components/ui/fullscreen-dialog";
import { Input } from "@/components/ui/input";
import {
    Item,
    ItemContent,
    ItemFooter,
    ItemGroup,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";
import { Kbd } from "@/components/ui/kbd";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryNarrativeHistory } from "@/hooks/useQueryInterface";
import { useSearchParamState, useSetSearchParamState } from "@/hooks/useSearchParamState";
import { cn } from "@/lib/utils";
import { useHotkeys } from "@tanstack/react-hotkeys";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { Check, Search } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

function HistoryList({ searchString }: { searchString?: string }) {
    const { data = [] } = useQueryNarrativeHistory({ searchString });

    return (
        <ItemGroup>
            {data.map((item, index) => {
                const key = `${item.character ?? "unknown"}-${item.text}-${index}`;
                return (
                    <Item key={key} variant="outline">
                        {item.character && (
                            <ItemMedia variant="image">
                                <Avatar size="sm">
                                    <AvatarImage src={item.icon} />
                                    <AvatarFallback>
                                        {item.character?.slice(0, 1).toUpperCase() ?? "?"}
                                    </AvatarFallback>
                                </Avatar>
                            </ItemMedia>
                        )}
                        <ItemContent className={!item.character ? "items-center text-center" : undefined}>
                            {item.character && <ItemTitle>{item.character}</ItemTitle>}
                            <Markdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    p: ({ children, id }) => (
                                        <p key={id} className="m-0 text-sm text-muted-foreground">
                                            {children}
                                        </p>
                                    ),
                                }}
                            >
                                {item.text}
                            </Markdown>
                        </ItemContent>
                        {(item.choices?.some((c) => !c.hidden) || item.inputValue) && (
                            <ItemFooter className="flex-wrap justify-start gap-1.5">
                                {item.choices?.map((choice) => {
                                    const choiceKey = `${choice.text}-${choice.isResponse ? "1" : "0"}-${choice.hidden ? "1" : "0"}`;
                                    if (choice.hidden) {
                                        return null;
                                    }
                                    if (choice.isResponse) {
                                        return (
                                            <Kbd
                                                key={`choices-success-${choiceKey}`}
                                                className={cn(
                                                    "h-auto border px-2 py-1",
                                                    "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400",
                                                )}
                                            >
                                                {choice.text}
                                                <Check className="size-3" />
                                            </Kbd>
                                        );
                                    }
                                    return (
                                        <Kbd
                                            key={`choices-${choiceKey}`}
                                            className={cn(
                                                "h-auto border px-2 py-1",
                                                "border-primary/30 bg-primary/10 text-primary",
                                            )}
                                        >
                                            {choice.text}
                                        </Kbd>
                                    );
                                })}
                                {item.inputValue && (
                                    <Kbd className="h-auto px-2 py-1">
                                        {item.inputValue.toString()}
                                    </Kbd>
                                )}
                            </ItemFooter>
                        )}
                    </Item>
                );
            })}
        </ItemGroup>
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
            <FullscreenDialogContent title={t("history")} toolbar={toolbar}>
                <ScrollArea className="flex-1 min-h-0">
                    <div className="p-4 px-2 sm:px-12 md:px-14 lg:px-22 xl:px-28">
                        <HistoryList searchString={debouncedSearchString} />
                    </div>
                </ScrollArea>
            </FullscreenDialogContent>
        </Dialog>
    );
}
