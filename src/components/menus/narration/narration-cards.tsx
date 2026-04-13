import { type RefObject, useMemo } from "react";
import { NarrationText } from "@/components/menus/narration/narration-texts";
import { Card, CardContent } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

type NarrationCharacter = {
    color?: string;
    icon?: string;
    name?: string;
    surname?: string;
};

export function NarrationCards({
    cardImageWidth,
    character,
    hidden,
    paragraphRef,
    onCardImageWidthChange,
}: {
    cardImageWidth: number;
    character?: NarrationCharacter;
    hidden: boolean;
    paragraphRef: RefObject<HTMLDivElement | null>;
    onCardImageWidthChange: (value: number) => void;
}) {
    const cardVariants = useMemo(
        () =>
            hidden
                ? "animate-out fade-out-0 slide-out-to-bottom-1/2"
                : "animate-in fade-in-0 slide-in-from-bottom-1/2",
        [hidden],
    );

    const cardImageVariants = useMemo(
        () =>
            !hidden && character?.icon
                ? "animate-in fade-in-0 slide-in-from-left-[5%]"
                : "animate-out fade-out-0",
        [hidden, character?.icon],
    );

    const textBlock = (
        <CardContent className="flex h-full min-w-0 flex-1 flex-col gap-2 px-3 py-2 sm:px-4 sm:py-3">
            <p
                className={cn(
                    "min-h-[1.75rem] px-1 text-xl font-semibold",
                    character?.name ? "animate-in fade-in-0 slide-in-from-left-[3%]" : "animate-out fade-out-0",
                )}
                style={{ color: character?.color }}
            >
                {`${character?.name || ""} ${character?.surname || ""}`.trim()}
            </p>
            <div
                ref={paragraphRef}
                className="mb-0 min-h-0 flex-1 overflow-auto rounded-md bg-muted/40 p-3 md:mx-3 md:mb-3"
            >
                <NarrationText paragraphRef={paragraphRef} />
            </div>
        </CardContent>
    );
    const characterAlt = `${character?.name || ""} ${character?.surname || ""}`.trim() || "Character icon";

    return (
        <div
            className={cn("shrink-0 min-h-0", cardVariants)}
            style={{
                height: "100%",
                pointerEvents: hidden ? "none" : "auto",
            }}
        >
            <Card className="mx-[0.9rem] flex h-full flex-row gap-0 overflow-hidden p-0 sm:mx-[1rem] md:mx-[1.1rem] lg:mx-[1.3rem] xl:mx-[1.4rem]">
                {character?.icon ? (
                    <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
                        <ResizablePanel
                            defaultSize={Math.max(5, Math.min(75, cardImageWidth))}
                            minSize={5}
                            maxSize={75}
                            onResize={(value) => onCardImageWidthChange(Number(value))}
                        >
                            <div className={cn("h-full w-full", cardImageVariants)}>
                                <img
                                    src={character.icon}
                                    loading="lazy"
                                    alt={characterAlt}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </ResizablePanel>
                        <ResizableHandle
                            withHandle
                            className={cn(
                                "bg-transparent after:bg-transparent",
                                hidden ? "pointer-events-none opacity-0" : "opacity-100",
                            )}
                        />
                        <ResizablePanel defaultSize={100 - cardImageWidth} minSize={25}>
                            {textBlock}
                        </ResizablePanel>
                    </ResizablePanelGroup>
                ) : (
                    textBlock
                )}
            </Card>
        </div>
    );
}
