import type { RefObject } from "react";
import { NarrationText } from "@/components/menus/narration/narration-texts";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useQueryDialogue } from "@/hooks/useQueryInterface";
import { cn } from "@/lib/utils";

export function NarrationCards({
    paragraphRef,
}: {
    paragraphRef: RefObject<HTMLDivElement | null>;
}) {
    const { data: { character } = {} } = useQueryDialogue();

    const textBlock = (
        <CardContent className="flex h-full min-w-0 flex-1 flex-col gap-2 px-3 py-2 sm:px-4 sm:py-3">
            <p
                className={cn(
                    "min-h-[1.75rem] px-1 text-xl font-semibold",
                    character?.name
                        ? "animate-in fade-in-0 slide-in-from-left-[3%]"
                        : "animate-out fade-out-0",
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
    const characterAlt =
        `${character?.name || ""} ${character?.surname || ""}`.trim() || "Character icon";

    return (
        <Card className="mx-[0.9rem] flex h-full flex-row gap-0 overflow-hidden p-0 sm:mx-[1rem] md:mx-[1.1rem] lg:mx-[1.3rem] xl:mx-[1.4rem]">
            {character?.icon ? (
                <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
                    <ResizablePanel defaultSize={"10%"}>
                        <AspectRatio ratio={16 / 9}>
                            <img
                                src={character.icon}
                                loading="lazy"
                                alt={characterAlt}
                                className="h-full w-full object-cover"
                            />
                        </AspectRatio>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel>{textBlock}</ResizablePanel>
                </ResizablePanelGroup>
            ) : (
                textBlock
            )}
        </Card>
    );
}
