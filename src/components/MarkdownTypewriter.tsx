import { motion, Variants } from "motion/react";
import { useMemo } from "react";
import Markdown from "react-markdown";
import MarkdownTypewriterProps from "./MarkdownTypewriterProps";
import markdownComponents from "./markdownComponents";

export default function MarkdownTypewriter(props: MarkdownTypewriterProps) {
    const { delay = 10, children: text, motionProps = {}, ...rest } = props;
    const {
        characterVariants: letterVariantsProp = {
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { opacity: { duration: 0 } } },
        },
        onCharacterAnimationComplete,
        ...restMotionProps
    } = motionProps;
    const sentenceVariants = useMemo<Variants>(
        () => ({
            hidden: {},
            visible: { opacity: 1, transition: { staggerChildren: delay / 1000 } },
        }),
        [delay]
    );
    const characterVariants = useMemo<Variants>(() => letterVariantsProp, [delay]);
    const components = useMemo(
        () =>
            markdownComponents({
                characterVariants,
                onCharacterAnimationComplete,
                delay,
            }),
        [delay, characterVariants, onCharacterAnimationComplete]
    );

    return (
        <motion.span
            key={`typewriter-internal-${text}`}
            variants={sentenceVariants}
            initial='hidden'
            animate={"visible"}
            {...restMotionProps}
        >
            <Markdown {...rest} components={components}>
                {text}
            </Markdown>
        </motion.span>
    );
}
