import { useStore } from "@tanstack/react-store";
import { useMemo, useRef } from "react";
import { ChoiceMenu } from "@/components/menus/choice-menus";
import { NarrationCards } from "@/components/menus/narration/narration-cards";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useQueryDialogue } from "@/hooks/useQueryInterface";
import { InterfaceSettings } from "@/lib/stores/interface-settings-store";
import { cn } from "@/lib/utils";

export default function NarrationScreen() {
    const cardHeightTemp = useStore(InterfaceSettings.store, (state) => state.dialogueCardHeight);
    const cardImageWidth = useStore(
        InterfaceSettings.store,
        (state) => state.dialogueCardImageWidth,
    );
    const { data: { animatedText, character, text } = {} } = useQueryDialogue();
    const hidden = useStore(
        InterfaceSettings.store,
        (state) => state.hidden || !(animatedText || text),
    );
    const cardHeight = animatedText || text ? cardHeightTemp : 0;
    const hasDialogue = Boolean(animatedText || text);
    const sliderVarians = useMemo(
        () =>
            hidden
                ? `duration-200 animate-out fade-out-0 slide-out-to-bottom-[25%]`
                : `animate-in fade-in-0 slide-in-from-bottom-[25%]`,
        [hidden],
    );
    const paragraphRef = useRef<HTMLDivElement>(null);

    return (
        <div className="absolute flex h-full w-full flex-col">
            <div className="flex min-h-0 flex-1 flex-col">
                <ResizablePanelGroup
                    orientation="vertical"
                    className="h-full w-full pb-[0.9rem] sm:pb-[1rem] md:pb-[1.1rem] lg:pb-[1.3rem] xl:pb-[1.4rem]"
                    key={hasDialogue ? "has-dialogue" : "no-dialogue"}
                >
                    <ResizablePanel defaultSize={100 - cardHeight} minSize={0}>
                        <ChoiceMenu />
                    </ResizablePanel>
                    <ResizableHandle
                        withHandle
                        className={cn(
                            "bg-transparent after:bg-transparent",
                            sliderVarians,
                            hidden ? "pointer-events-none opacity-0" : "opacity-100",
                        )}
                    />
                    <ResizablePanel
                        defaultSize={cardHeight}
                        minSize={0}
                        maxSize={100}
                        onResize={(value) => {
                            const nextValue = Number(value);
                            InterfaceSettings.setDialogueCardHeight(Math.max(0, Math.min(100, nextValue)));
                        }}
                    >
                        <NarrationCards
                            hidden={hidden}
                            cardHeight={100}
                            cardImageWidth={cardImageWidth}
                            character={character}
                            paragraphRef={paragraphRef}
                            onCardImageWidthChange={(value) => {
                                InterfaceSettings.setDialogueCardImageWidth(Math.max(5, Math.min(75, value)));
                            }}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
            <div className="h-[0.9rem] shrink-0 sm:h-[1rem] md:h-[1.1rem] lg:h-[1.3rem] xl:h-[1.4rem]" />
        </div>
    );
}
