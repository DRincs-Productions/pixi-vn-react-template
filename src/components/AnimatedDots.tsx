import { motion } from "framer-motion";

export default function AnimatedDots() {
    const dots = [".", ".", "."]; // I caratteri da animare

    return (
        <motion.span
            style={{ display: "flex", pointerEvents: "none", userSelect: "none" }}
            transition={{
                staggerChildren: 0.2,
            }}
            initial='closed'
            animate='open'
        >
            {dots.map((dot, index) => (
                <motion.span
                    key={index}
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
                    {dot}
                </motion.span>
            ))}
        </motion.span>
    );
}
