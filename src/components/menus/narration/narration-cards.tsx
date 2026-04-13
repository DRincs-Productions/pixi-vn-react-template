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
    const characterAlt = `${character?.name || ""} ${character?.surname || ""}`.trim();
    const characterName = `${character?.name || ""} ${character?.surname || ""}`.trim();

    return (
        <div className="flex h-full flex-col">
            {/* Character name – outside the card, left-aligned just above it */}
            <p
                className={cn(
                    "shrink-0 px-1 text-xl font-semibold leading-tight",
                    characterName
                        ? "animate-in fade-in-0 slide-in-from-left-[3%]"
                        : "invisible",
                )}
                style={{ color: character?.color }}
            >
                {characterName || "\u00A0"}
            </p>
            <Card className="min-h-0 flex-1 flex-row p-0">
                <ResizablePanelGroup orientation="horizontal">
                    <ResizablePanel defaultSize={"16%"}>
                        {character?.icon && <CharacterIcon icon={character.icon} alt={characterAlt} />}
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel>
                        <CardContent ref={paragraphRef} className="h-full w-full overflow-y-auto px-1">
                            <Text paragraphRef={paragraphRef} />
                        </CardContent>
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

export function CharacterIcon({ alt, icon }: { icon: string; alt: string }) {
    return (
        <AspectRatio ratio={16 / 9}>
            <img src={icon} loading="lazy" alt={alt} className="h-full w-full object-cover" />
        </AspectRatio>
    );
}
