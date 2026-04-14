import { useStore } from "@tanstack/react-store";
import { type RefObject, useCallback, useRef } from "react";
import Markdown from "react-markdown";
import { MarkdownTypewriterHooks } from "react-markdown-typewriter";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import AnimatedDots from "@/components/AnimatedDots";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useQueryDialogue } from "@/hooks/useQueryInterface";
import { TypewriterSettings } from "@/lib/stores/typewriter-settings-store";

export function NarrationCards() {
    const { data: { character } = {} } = useQueryDialogue();
    const paragraphRef = useRef<HTMLDivElement>(null);
    const characterName = `${character?.name || ""} ${character?.surname || ""}`.trim();

    return (
        <div className="flex h-full flex-col">
            <Card className="min-h-0 flex-1 flex-row">
                <ResizablePanelGroup orientation="horizontal">
                    {character?.icon && (
                        <ResizablePanel defaultSize={"16%"}>
                            <CharacterIcon icon={character.icon} alt={characterName} />
                        </ResizablePanel>
                    )}
                    {character?.icon && <ResizableHandle />}
                    <ResizablePanel>
                        <div className="flex h-full flex-col">
                            {character && (
                                <p
                                    className="shrink-0 px-7 pt-3 text-xl font-bold"
                                    style={{ color: character?.color }}
                                >
                                    {characterName}
                                </p>
                            )}
                            <CardContent
                                ref={paragraphRef}
                                className="min-h-0 flex-1 overflow-y-auto px-7"
                            >
                                <Text paragraphRef={paragraphRef} />
                            </CardContent>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </Card>
        </div>
    );
}

export function Text({ paragraphRef }: { paragraphRef: RefObject<HTMLDivElement | null> }) {
    const typewriterDelay = useStore(TypewriterSettings.store, (state) => state.delay);
    const { data: { animatedText, text } = {} } = useQueryDialogue();

    const handleCharacterAnimationComplete = useCallback(
        (ref: { current: HTMLSpanElement | null }) => {
            const container = paragraphRef.current;
            const char = ref.current;
            if (container && char) {
                const containerRect = container.getBoundingClientRect();
                const charRect = char.getBoundingClientRect();
                // Position of the character relative to the top of the scroll container
                const charOffsetInContainer =
                    charRect.top - containerRect.top + container.scrollTop;
                const scrollTop = charOffsetInContainer - container.clientHeight / 2;
                container.scrollTo({
                    top: scrollTop,
                    behavior: "smooth",
                });
            }
        },
        [paragraphRef],
    );

    return (
        <p className="prose dark:prose-invert m-0 max-w-full p-0">
            <span>
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        p: (props) => <span {...props} />,
                    }}
                >
                    {text}
                </Markdown>
            </span>
            <span>
                <span> </span>
                <MarkdownTypewriterHooks
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    delay={typewriterDelay}
                    motionProps={{
                        onAnimationStart: TypewriterSettings.start,
                        onAnimationComplete: (definition: "visible" | "hidden") => {
                            if (definition === "visible") {
                                TypewriterSettings.end();
                            }
                        },
                        onCharacterAnimationComplete: handleCharacterAnimationComplete,
                    }}
                    fallback={<AnimatedDots />}
                >
                    {animatedText}
                </MarkdownTypewriterHooks>
            </span>
        </p>
    );
}

export function CharacterIcon({ alt, icon }: { icon: string; alt: string }) {
    return (
        <AspectRatio ratio={16 / 9}>
            <img src={icon} loading="lazy" alt={alt} className="h-full w-full object-cover" />
        </AspectRatio>
    );
}
