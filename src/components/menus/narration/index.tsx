import { useStore } from "@tanstack/react-store";
import { useRef } from "react";
import { ChoiceMenu } from "@/components/menus/choice-menus";
import { NarrationCards } from "@/components/menus/narration/narration-cards";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useQueryDialogue } from "@/hooks/useQueryInterface";
import { InterfaceSettings } from "@/lib/stores/interface-settings-store";

export default function NarrationScreen() {
    const cardImageWidth = useStore(
        InterfaceSettings.store,
        (state) => state.dialogueCardImageWidth,
    );
    const { data: { animatedText, character, text } = {} } = useQueryDialogue();
    const hidden = useStore(
        InterfaceSettings.store,
        (state) => state.hidden || !(animatedText || text),
    );
    const paragraphRef = useRef<HTMLDivElement>(null);

    return (
        <div className="absolute flex h-full w-full flex-col">
            <div className="flex min-h-0 flex-1 flex-col">
                <ResizablePanelGroup orientation="vertical">
                    <ResizablePanel>
                        <ChoiceMenu />
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={"30%"}>
                        <NarrationCards
                            hidden={hidden}
                            cardImageWidth={cardImageWidth}
                            character={character}
                            paragraphRef={paragraphRef}
                            onCardImageWidthChange={(value) => {
                                InterfaceSettings.setDialogueCardImageWidth(
                                    Math.max(5, Math.min(75, value)),
                                );
                            }}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
            <div className="h-[0.9rem] shrink-0 sm:h-[1rem] md:h-[1.1rem] lg:h-[1.3rem] xl:h-[1.4rem]" />
        </div>
    );
}
