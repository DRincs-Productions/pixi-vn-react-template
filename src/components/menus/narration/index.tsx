import { ChoiceMenu } from "@/components/menus/choice-menus";
import { NarrationCards } from "@/components/menus/narration/narration-cards";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useQueryDialogue } from "@/hooks/useQueryInterface";

export default function NarrationScreen() {
    const { data: { animatedText, text } = {} } = useQueryDialogue();

    return (
        <div className="absolute flex h-full w-full flex-col">
            <div className="flex min-h-0 flex-1 flex-col">
                <ResizablePanelGroup orientation="vertical">
                    <ResizablePanel>
                        <ChoiceMenu />
                    </ResizablePanel>
                    {(animatedText || text) && <ResizableHandle className="mx-3" />}
                    {(animatedText || text) && (
                        <ResizablePanel defaultSize={"30%"}>
                            <NarrationCards />
                        </ResizablePanel>
                    )}
                </ResizablePanelGroup>
            </div>
            <div className="h-[0.9rem] shrink-0 sm:h-[1rem] md:h-[1.1rem] lg:h-[1.3rem] xl:h-[1.4rem]" />
        </div>
    );
}
