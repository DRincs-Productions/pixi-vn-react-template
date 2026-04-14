import { ChoiceMenu } from "@/components/menus/choice-menus";
import { NarrationCards } from "@/components/menus/narration/narration-cards";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useQueryDialogue } from "@/hooks/useQueryInterface";

export default function NarrationScreen() {
    const { data: { animatedText, text } = {} } = useQueryDialogue();

    return (
        <div className="absolute flex h-full w-full flex-col">
            <div className="flex min-h-0 flex-1 flex-col mb-4 mx-4 sm:mx-10 md:mx-20 lg:mx-20">
                <ResizablePanelGroup orientation="vertical">
                    <ResizablePanel>
                        <ChoiceMenu />
                    </ResizablePanel>
                    {(animatedText || text) && (
                        <div className="mx-4">
                            <ResizableHandle />
                        </div>
                    )}
                    {(animatedText || text) && (
                        <ResizablePanel defaultSize={"30%"}>
                            <NarrationCards />
                        </ResizablePanel>
                    )}
                </ResizablePanelGroup>
            </div>
        </div>
    );
}
