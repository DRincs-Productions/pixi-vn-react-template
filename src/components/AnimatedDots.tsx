import { motion } from "motion/react";

export default function AnimatedDots() {
    const dots = [
        { id: "dot-1", char: "." },
        { id: "dot-2", char: "." },
        { id: "dot-3", char: "." },
    ]; // I caratteri da animare

    return (
        <motion.span
            style={{ display: "flex", pointerEvents: "none", userSelect: "none" }}
            transition={{
                staggerChildren: 0.2,
            }}
            initial="closed"
            animate="open"
        >
            {dots.map((dot) => (
                <motion.span
                    key={dot.id}
                    initial={{ y: 0 }}
                    variants={{
                        open: {
                            y: 5,
                            transition: {
                                repeat: Infinity,
                                duration: 0.5,
                                ease: "easeInOut",
                                repeatType: "reverse",
                            },
                        },
                        closed: {
                            y: 0,
                            transition: {
                                repeat: Infinity,
                                duration: 0.5,
                                ease: "easeInOut",
                                repeatType: "reverse",
                            },
                        },
                    }}
                >
                    {dot.char}
                </motion.span>
            ))}
        </motion.span>
    );
}
