import { motion, Variants } from "motion/react";
import { Key, useMemo } from "react";

export default function Typewriter({
    text,
    index,
    delay = 0,
    onAnimationComplete,
    onAnimationStart,
}: {
    text: string;
    index?: Key | null | undefined;
    delay?: number;
    onAnimationComplete?: () => void;
    onAnimationStart?: () => void;
    scroll?: (offsetTop: number) => void;
}) {
    const sentenceVariants: Variants = {
        hidden: {},
        visible: { opacity: 1, transition: { staggerChildren: delay / 1000 } },
    };
    const letterVariants = useMemo<Variants>(
        () => ({
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { opacity: { duration: 0 } } },
        }),
        [delay]
    );

    const text1 = "Hello, World!";
    const text2 = "I am a software developer.";
    const text3 = "I love to code.";

    return (
        <motion.span
            key={index ?? text}
            variants={sentenceVariants}
            initial='hidden'
            animate={"visible"}
            onAnimationStart={onAnimationStart}
            onAnimationComplete={onAnimationComplete}
        >
            <motion.div variants={letterVariants}>
                {text1.split("").map((char, i) => {
                    return (
                        <motion.span key={`span-${char}-${i}`} variants={letterVariants}>
                            {char}
                        </motion.span>
                    );
                })}
            </motion.div>
            <motion.div variants={letterVariants}>
                {text2.split("").map((char, i) => {
                    return (
                        <motion.span key={`span-${char}-${i}`} variants={letterVariants}>
                            {char}
                        </motion.span>
                    );
                })}
            </motion.div>
            <motion.div variants={letterVariants}>
                {text3.split("").map((char, i) => {
                    return (
                        <motion.span key={`span-${char}-${i}`} variants={letterVariants}>
                            {char}
                        </motion.span>
                    );
                })}
            </motion.div>
        </motion.span>
    );
}
