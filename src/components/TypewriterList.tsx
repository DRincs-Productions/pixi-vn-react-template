import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import Typewriter from "./Typewriter";

export default function TypewriterList({
    text,
    delay = 0,
    onAnimationComplete,
    onAnimationStart,
    scroll,
}: {
    text: string;
    delay?: number;
    onAnimationComplete?: () => void;
    onAnimationStart?: () => void;
    scroll?: (offsetTop: number) => void;
}) {
    const [texts, setTexts] = useState<string[]>([]);
    useEffect(() => {
        if (setTexts.length > 0 && text.startsWith(texts[0])) {
            let tempT = text;
            let newTexts = [];
            for (let t of texts) {
                if (tempT.startsWith(t)) {
                    newTexts.push(t);
                    tempT = tempT.slice(t.length);
                } else {
                    setTexts([text]);
                    return;
                }
            }
            if (tempT.length > 0) {
                newTexts.push(tempT);
            }
            setTexts(newTexts);
            return;
        }
        setTexts([text]);
    }, [text]);

    const textsToRender = useMemo(() => {
        return texts.map((t, index) =>
            t.length > 0 ? (
                <motion.span key={index}>
                    {t[0] == " " && <motion.span> </motion.span>}
                    <Typewriter
                        text={t}
                        index={index + t}
                        delay={delay}
                        onAnimationStart={texts.length - 1 == index ? onAnimationStart : undefined}
                        onAnimationComplete={texts.length - 1 == index ? onAnimationComplete : undefined}
                        scroll={scroll}
                    />
                    {t[t.length - 1] == " " && <motion.span> </motion.span>}
                </motion.span>
            ) : null
        );
    }, [texts]);

    return <motion.p>{textsToRender.map((t) => t)}</motion.p>;
}
