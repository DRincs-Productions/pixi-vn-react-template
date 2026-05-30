import { Spinner } from "@/components/ui/spinner";
import { motion } from "motion/react";

export function PendingComponent() {
    return (
        <div className="h-screen w-screen">
            <div className="absolute bottom-0 right-0 p-2 animate-in zoom-in-95 fade-in-0">
                <Spinner className="size-10 text-white" />
            </div>
        </div>
    );
}

export function AnimatedDots() {
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
