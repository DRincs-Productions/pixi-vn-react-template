import { useStore } from "@tanstack/react-store";
import React, { type RefObject, useCallback, useRef } from "react";
import Markdown from "react-markdown";
import { MarkdownTypewriterHooks } from "react-markdown-typewriter";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import AnimatedDots from "@/components/AnimatedDots";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import useNarrationFunctions from "@/hooks/useNarrationFunctions";
import { useQueryDialogue } from "@/hooks/useQueryInterface";
import { TypewriterSettings } from "@/lib/stores/typewriter-settings-store";

export function NarrationCards() {
    const { data: { character } = {} } = useQueryDialogue();
    const paragraphRef = useRef<HTMLDivElement>(null);
    const characterName = `${character?.name || ""} ${character?.surname || ""}`.trim();
    const { goNext } = useNarrationFunctions();

    const handlePointerDown = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            // Let resize handles manage their own drag behaviour
            if ((e.target as HTMLElement).closest('[data-slot="resizable-handle"]')) return;

            // Let native scrollbar clicks through (scrollbar sits between clientWidth and the right edge)
            const scrollable = paragraphRef.current;
            if (scrollable) {
                const rect = scrollable.getBoundingClientRect();
                const isInsideScrollable =
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom;
                if (isInsideScrollable && e.clientX > rect.left + scrollable.clientWidth) return;
            }

            // Find whatever element is physically underneath the card by briefly disabling its
            // pointer-events, then forward the event to that element so it reaches the correct target
            // regardless of what is rendered behind the card (canvas, image, etc.)
            const card = e.currentTarget;
            card.style.pointerEvents = "none";
            const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
            card.style.pointerEvents = "";

            if (!elementBelow) return;

            elementBelow.dispatchEvent(
                new PointerEvent("pointerdown", {
                    bubbles: true,
                    cancelable: true,
                    clientX: e.clientX,
                    clientY: e.clientY,
                    pointerId: e.pointerId,
                    pointerType: e.pointerType,
                    button: e.button,
                    buttons: e.buttons,
                    pressure: e.pressure,
                }),
            );

            window.addEventListener(
                "pointerup",
                (upEvent: PointerEvent) => {
                    card.style.pointerEvents = "none";
                    const upElementBelow = document.elementFromPoint(
                        upEvent.clientX,
                        upEvent.clientY,
                    );
                    card.style.pointerEvents = "";
                    upElementBelow?.dispatchEvent(
                        new PointerEvent("pointerup", {
                            bubbles: true,
                            cancelable: true,
                            clientX: upEvent.clientX,
                            clientY: upEvent.clientY,
                            pointerId: upEvent.pointerId,
                            pointerType: upEvent.pointerType,
                            button: upEvent.button,
                            buttons: 0,
                        }),
                    );
                },
                { once: true },
            );
        },
        // eslint-disable-next-line -- paragraphRef is a stable ref object
        [],
    );

    return (
        <div className="flex h-full flex-col">
            <Card className="pointer-events-none min-h-0 flex-1 flex-row">
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
                                    className="shrink-0 px-7 text-xl font-bold"
                                    style={{ color: character?.color }}
                                >
                                    {characterName}
                                </p>
                            )}
                            <CardContent
                                ref={paragraphRef}
                                className="pointer-events-auto min-h-0 flex-1 overflow-y-auto px-7"
                                onPointerDown={handlePointerDown}
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
