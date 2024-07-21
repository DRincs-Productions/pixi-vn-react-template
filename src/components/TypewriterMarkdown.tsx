import { Typography, TypographyProps, useTheme } from "@mui/joy";
import { motion, Variants } from "framer-motion";
import { useMemo } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

function TypewriterMarkdownInternal({ children, letterVariants, dadElement }: {
    children: any,
    letterVariants: Variants;
    dadElement: (children: JSX.Element | JSX.Element[]) => JSX.Element | JSX.Element[];
    isRoot?: boolean;
}) {
    if (typeof children === "string") {
        const spanList = children.split("").map((char, i) => (
            <motion.span key={`span-${char}-${i}`} variants={letterVariants} >
                {char}
            </motion.span>
        ))
        return dadElement(spanList)
    }
    else if (Array.isArray(children)) {
        const list = children.map((child) => {
            if (typeof child === "string") {
                let spanList = child.split("").map((char, i) => (
                    <motion.span key={`span-${char}-${i}`} variants={letterVariants} >
                        {char}
                    </motion.span>
                ))
                return spanList
            }
            return child
        })
        return dadElement(list)
    }
    return dadElement(children)
};

export default function TypewriterMarkdown({ text, delay = 0, ...rest }: { text: string; delay?: number; } & TypographyProps) {
    const sentenceVariants: Variants = {
        hidden: {},
        visible: { opacity: 1, transition: { staggerChildren: delay / 1000 } },
    };
    const letterVariants = useMemo<Variants>(() => ({
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { opacity: { duration: 0 } } },
    }), [delay]);

    return (
        <Typography
            component={motion.div}
            key={text}
            variants={sentenceVariants}
            initial="hidden"
            animate="visible"
            {...rest}
        >
            <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    p: ({ children }) => {
                        return <TypewriterMarkdownInternal
                            children={children}
                            letterVariants={letterVariants}
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
                        return <TypewriterMarkdownInternal
                            children={children}
                            letterVariants={letterVariants}
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
                        return <TypewriterMarkdownInternal
                            children={children}
                            letterVariants={letterVariants}
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
                        return <TypewriterMarkdownInternal
                            children={children}
                            letterVariants={letterVariants}
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
                        return <TypewriterMarkdownInternal
                            children={children}
                            letterVariants={letterVariants}
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
                        return <TypewriterMarkdownInternal
                            children={children}
                            letterVariants={letterVariants}
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
                        return <TypewriterMarkdownInternal
                            children={children}
                            letterVariants={letterVariants}
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
                        return <TypewriterMarkdownInternal
                            children={children}
                            letterVariants={letterVariants}
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
                        return <TypewriterMarkdownInternal
                            children={children}
                            letterVariants={letterVariants}
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
                        return <TypewriterMarkdownInternal
                            children={children}
                            letterVariants={letterVariants}
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
                        return <TypewriterMarkdownInternal
                            children={children}
                            letterVariants={letterVariants}
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
                        return <TypewriterMarkdownInternal
                            children={children}
                            letterVariants={letterVariants}
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
                        return <TypewriterMarkdownInternal
                            children={children}
                            letterVariants={letterVariants}
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
                        return <TypewriterMarkdownInternal
                            children={children}
                            letterVariants={letterVariants}
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
                        return <TypewriterMarkdownInternal
                            children={children}
                            letterVariants={letterVariants}
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
        </Typography>
    )
};
