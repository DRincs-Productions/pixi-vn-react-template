import { ChoiceMenu } from "@/components/menus/choice-menus";
import { NarrationCards } from "@/components/screens/narration/narration-cards";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { QuickTools } from "@/components/quick-tools";
import { useQueryDialogue } from "@/lib/query/narration-query";

export function NarrationScreen() {
    const { data: { animatedText, text } = {} } = useQueryDialogue();
    const hasText = !!(animatedText || text);

    return (
        <div className="absolute flex h-full w-full flex-col">
            <div className="mb-0 mx-0 flex min-h-0 flex-1 flex-col sm:mb-4 sm:mx-10 md:mx-20 lg:mx-20">
                <ResizablePanelGroup orientation="vertical">
                    <ResizablePanel>
                        <ChoiceMenu />
                    </ResizablePanel>
                    {hasText && (
                        <div className="mx-4">
                            <ResizableHandle />
                        </div>
                    )}
                    {hasText && (
                        <ResizablePanel defaultSize={"40%"}>
                            <NarrationCards />
                        </ResizablePanel>
                    )}
                </ResizablePanelGroup>
                {!hasText && <QuickTools />}
            </div>
        </div>
    );
}
