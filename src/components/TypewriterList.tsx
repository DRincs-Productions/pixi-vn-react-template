import { motion } from "motion/react";
import { RefObject, useEffect, useMemo, useState } from "react";
import Typewriter from "./Typewriter";

export default function TypewriterList({
    text,
    delay = 0,
    onAnimationComplete,
    onAnimationStart,
    paragraphRef,
}: {
    text: string;
    delay?: number;
    onAnimationComplete?: () => void;
    onAnimationStart?: () => void;
    paragraphRef?: RefObject<HTMLDivElement | null>;
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
        return texts.map((t, index) => {
            if (t.length == 0) return null;
            return (
                <motion.span key={index}>
                    {t[0] == " " && <motion.span> </motion.span>}
                    <Typewriter
                        text={t}
                        index={index + t}
                        delay={delay}
                        onAnimationStart={texts.length - 1 == index ? onAnimationStart : undefined}
                        onAnimationComplete={texts.length - 1 == index ? onAnimationComplete : undefined}
                        paragraphRef={paragraphRef}
                    />
                    {t[t.length - 1] == " " && <motion.span> </motion.span>}
                </motion.span>
            );
        });
    }, [texts]);

    return <motion.p style={{ margin: 0, padding: 0 }}>{textsToRender.map((t) => t)}</motion.p>;
}
