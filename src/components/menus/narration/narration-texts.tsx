import { useColorScheme } from "@mui/joy";
import { useStore } from "@tanstack/react-store";
import { type RefObject, useCallback } from "react";
import Markdown from "react-markdown";
import { MarkdownTypewriterHooks } from "react-markdown-typewriter";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import AnimatedDots from "@/components/AnimatedDots";
import { useQueryDialogue } from "@/hooks/useQueryInterface";
import { TypewriterSettings } from "@/lib/stores/typewriter-settings-store";

export function NarrationText({
    paragraphRef,
}: {
    paragraphRef: RefObject<HTMLDivElement | null>;
}) {
    const typewriterDelay = useStore(TypewriterSettings.store, (state) => state.delay);
    const { data: { animatedText, text } = {} } = useQueryDialogue();
    const { mode } = useColorScheme();

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
        <p
            className={`prose ${mode === "dark" ? "dark:prose-invert" : ""}`}
            style={{ margin: 0, padding: 0, maxWidth: "100%" }}
        >
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
