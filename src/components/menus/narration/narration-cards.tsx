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
import { cn } from "@/lib/utils";

export function NarrationCards() {
    const { data: { character } = {} } = useQueryDialogue();
    const paragraphRef = useRef<HTMLDivElement>(null);

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
                <Text paragraphRef={paragraphRef} />
            </div>
        </CardContent>
    );
    const characterAlt =
        `${character?.name || ""} ${character?.surname || ""}`.trim() || "Character icon";

    return (
        <Card className="mx-[0.9rem] flex h-full flex-row gap-0 overflow-hidden p-0 sm:mx-[1rem] md:mx-[1.1rem] lg:mx-[1.3rem] xl:mx-[1.4rem]">
            {character?.icon ? (
                <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
                    <ResizablePanel defaultSize={"16%"}>
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

export function Text({ paragraphRef }: { paragraphRef: RefObject<HTMLDivElement | null> }) {
    const typewriterDelay = useStore(TypewriterSettings.store, (state) => state.delay);
    const { data: { animatedText, text } = {} } = useQueryDialogue();

    const handleCharacterAnimationComplete = useCallback(
        (ref: { current: HTMLSpanElement | null }) => {
            if (paragraphRef.current && ref.current) {
                const scrollTop = ref.current.offsetTop - paragraphRef.current.clientHeight / 2;
                paragraphRef.current.scrollTo({
                    top: scrollTop,
                    behavior: "auto",
                });
            }
        },
        [paragraphRef.current],
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
