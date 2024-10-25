import { useTheme } from "@mui/joy";
import { motion, Variants } from "framer-motion";
import { useMemo, useRef } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

function TypewriterInternal({ children, letterVariants, dadElement, scrollOnLastItem }: {
    children: any
    letterVariants: Variants
    dadElement: (children: JSX.Element | JSX.Element[]) => JSX.Element | JSX.Element[]
    isRoot?: boolean
    scrollOnLastItem?: (scrollTop: number) => void
}) {
    if (typeof children === "string") {
        const spanList = children.split("").map((char, i) => {
            const ref = useRef<HTMLSpanElement>(null);
            return <motion.span
                ref={ref}
                key={`span-${char}-${i}`}
                variants={letterVariants}
                onAnimationComplete={scrollOnLastItem ? () => {
                    if (ref.current?.offsetParent) {
                        scrollOnLastItem(ref.current.offsetTop)
                    }
                } : undefined}
            >
                {char}
            </motion.span>
        })
        return dadElement(spanList)
    }
    else if (Array.isArray(children)) {
        const list = children.map((child) => {
            if (typeof child === "string") {
                let spanList = child.split("").map((char, i) => {
                    const ref = useRef<HTMLSpanElement>(null);
                    return <motion.span
                        ref={ref}
                        key={`span-${char}-${i}`}
                        variants={letterVariants}
                        onAnimationComplete={scrollOnLastItem ? () => {
                            if (ref.current?.offsetParent) {
                                scrollOnLastItem(ref.current.offsetTop)
                            }
                        } : undefined}
                    >
                        {char}
                    </motion.span>
                })
                return spanList
            }
            return child
        })
        return dadElement(list)
    }
    return dadElement(children)
};

export default function Typewriter({ text, delay = 0, onAnimationComplete, onAnimationStart, scroll }: {
    text: string
    delay?: number
    onAnimationComplete?: () => void
    onAnimationStart?: () => void
    scroll?: (offsetTop: number) => void
}) {
    const sentenceVariants: Variants = {
        hidden: {},
        visible: { opacity: 1, transition: { staggerChildren: delay / 1000 } },
    };
    const letterVariants = useMemo<Variants>(() => ({
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { opacity: { duration: 0 } } },
    }), [delay]);

    return (
        <motion.div
            key={text}
            variants={sentenceVariants}
            initial="hidden"
            animate={"visible"}
            onAnimationStart={onAnimationStart}
            onAnimationComplete={onAnimationComplete}
        >
            <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    p: ({ children }) => {
                        return <TypewriterInternal
                            children={children}
                            letterVariants={letterVariants}
                            scrollOnLastItem={scroll}
                            dadElement={(children) => {
                                if (Array.isArray(children)) {
                                    children.push(<motion.br />)
                                    return children
                                }
                                return children
                            }}
                        />
                    },
                    a: ({ children, href, style }) => {
                        return <TypewriterInternal
                            children={children}
                            letterVariants={letterVariants}
                            scrollOnLastItem={scroll}
                            dadElement={(children) => <motion.a
                                href={href}
                                target="_blank"
                                style={{
                                    ...style,
                                    color: useTheme().palette.primary[500],
                                }}
                                variants={letterVariants}
                            >
                                {children}
                            </motion.a>
                            }
                        />
                    },
                    code: ({ children, style }) => {
                        return <TypewriterInternal
                            children={children}
                            letterVariants={letterVariants}
                            scrollOnLastItem={scroll}
                            dadElement={(children) => <motion.code
                                style={{
                                    ...style,
                                    backgroundColor: useTheme().palette.neutral[600],
                                    color: useTheme().palette.neutral[200],
                                }}
                                variants={letterVariants}
                            >
                                {children}
                            </motion.code>
                            }
                        />
                    },
                    ul: ({ children, style }) => {
                        return <TypewriterInternal
                            children={children}
                            letterVariants={letterVariants}
                            scrollOnLastItem={scroll}
                            dadElement={(children) => <motion.ul
                                style={{
                                    ...style,
                                    margin: 0,
                                }}
                                variants={letterVariants}
                            >
                                {children}
                            </motion.ul>
                            }
                        />
                    },
                    li: ({ children, style }) => {
                        return <TypewriterInternal
                            children={children}
                            letterVariants={letterVariants}
                            scrollOnLastItem={scroll}
                            dadElement={(children) => <motion.li
                                style={style}
                                variants={letterVariants}
                            >
                                {children}
                            </motion.li>
                            }
                        />
                    },
                    strong: ({ children, style }) => {
                        return <TypewriterInternal
                            children={children}
                            letterVariants={letterVariants}
                            scrollOnLastItem={scroll}
                            dadElement={(children) => <motion.strong
                                style={style}
                                variants={letterVariants}
                            >
                                {children}
                            </motion.strong>
                            }
                        />
                    },
                    em: ({ children, style }) => {
                        return <TypewriterInternal
                            children={children}
                            letterVariants={letterVariants}
                            scrollOnLastItem={scroll}
                            dadElement={(children) => <motion.em
                                style={style}
                                variants={letterVariants}
                            >
                                {children}
                            </motion.em>
                            }
                        />
                    },
                    hr: ({ style }) => {
                        return <motion.hr
                            style={style}
                            variants={letterVariants}
                        />
                    },
                    th: ({ children, style }) => {
                        return <TypewriterInternal
                            children={children}
                            letterVariants={letterVariants}
                            scrollOnLastItem={scroll}
                            dadElement={(children) => <motion.th
                                style={style}
                                variants={letterVariants}
                            >
                                {children}
                            </motion.th>
                            }
                        />
                    },
                    del: ({ children, style }) => {
                        return <TypewriterInternal
                            children={children}
                            letterVariants={letterVariants}
                            scrollOnLastItem={scroll}
                            dadElement={(children) => <motion.del
                                style={style}
                                variants={letterVariants}
                            >
                                {children}
                            </motion.del>
                            }
                        />
                    },
                    table: ({ children, style }) => {
                        return <TypewriterInternal
                            children={children}
                            letterVariants={letterVariants}
                            scrollOnLastItem={scroll}
                            dadElement={(children) => <motion.table
                                style={style}
                                variants={letterVariants}
                            >
                                {children}
                            </motion.table>
                            }
                        />
                    },
                    span: ({ children, style }) => {
                        return <TypewriterInternal
                            children={children}
                            letterVariants={letterVariants}
                            scrollOnLastItem={scroll}
                            dadElement={(children) => <motion.span
                                style={style}
                                variants={letterVariants}
                            >
                                {children}
                            </motion.span>
                            }
                        />
                    },
                    h1: ({ children, style }) => {
                        return <TypewriterInternal
                            children={children}
                            letterVariants={letterVariants}
                            scrollOnLastItem={scroll}
                            dadElement={(children) => <motion.h1
                                style={{
                                    ...style,
                                    margin: 0,
                                }}
                                variants={letterVariants}
                            >
                                {children}
                            </motion.h1>
                            }
                        />
                    },
                    h2: ({ children, style }) => {
                        return <TypewriterInternal
                            children={children}
                            letterVariants={letterVariants}
                            scrollOnLastItem={scroll}
                            dadElement={(children) => <motion.h2
                                style={{
                                    ...style,
                                    margin: 0,
                                }}
                                variants={letterVariants}
                            >
                                {children}
                            </motion.h2>
                            }
                        />
                    },
                    h3: ({ children, style }) => {
                        return <TypewriterInternal
                            children={children}
                            letterVariants={letterVariants}
                            scrollOnLastItem={scroll}
                            dadElement={(children) => <motion.h3
                                style={{
                                    ...style,
                                    margin: 0,
                                }}
                                variants={letterVariants}
                            >
                                {children}
                            </motion.h3>
                            }
                        />
                    },
                    h4: ({ children, style }) => {
                        return <TypewriterInternal
                            children={children}
                            letterVariants={letterVariants}
                            scrollOnLastItem={scroll}
                            dadElement={(children) => <motion.h4
                                style={{
                                    ...style,
                                    margin: 0,
                                }}
                                variants={letterVariants}
                            >
                                {children}
                            </motion.h4>
                            }
                        />
                    },
                }}
            >
                {text}
            </Markdown>
        </motion.div>
    )
};
