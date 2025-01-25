import { useTheme } from "@mui/joy";
import { motion, Variants } from "motion/react";
import { Key, useMemo, useRef } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

function TypewriterInternal({
    children,
    letterVariants,
    dadElement,
    scrollOnLastItem,
    key,
}: {
    children: any;
    letterVariants: Variants;
    dadElement: (children: JSX.Element | JSX.Element[]) => JSX.Element | JSX.Element[];
    isRoot?: boolean;
    scrollOnLastItem?: (scrollTop: number) => void;
    key?: Key | null | undefined;
}) {
    if (typeof children === "string") {
        const spanList = children.split("").map((char, i) => {
            const ref = useRef<HTMLSpanElement>(null);
            return (
                <motion.span
                    ref={ref}
                    key={`span-${key}-${char}-${i}`}
                    variants={letterVariants}
                    onAnimationComplete={
                        scrollOnLastItem
                            ? () => {
                                  if (ref.current?.offsetParent) {
                                      scrollOnLastItem(ref.current.offsetTop);
                                  }
                              }
                            : undefined
                    }
                >
                    {char}
                </motion.span>
            );
        });
        return dadElement(spanList);
    } else if (Array.isArray(children)) {
        const list = children.map((child) => {
            if (typeof child === "string") {
                let spanList = child.split("").map((char, i) => {
                    const ref = useRef<HTMLSpanElement>(null);
                    return (
                        <motion.span
                            ref={ref}
                            key={`span-${key}-${char}-${i}`}
                            variants={letterVariants}
                            onAnimationComplete={
                                scrollOnLastItem
                                    ? () => {
                                          if (ref.current?.offsetParent) {
                                              scrollOnLastItem(ref.current.offsetTop);
                                          }
                                      }
                                    : undefined
                            }
                        >
                            {char}
                        </motion.span>
                    );
                });
                return spanList;
            }
            return child;
        });
        return dadElement(list);
    }
    return dadElement(children);
}

export default function Typewriter({
    text,
    index,
    delay = 0,
    onAnimationComplete,
    onAnimationStart,
    scroll,
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

    return (
        <motion.span
            key={index ?? text}
            variants={sentenceVariants}
            initial='hidden'
            animate={"visible"}
            onAnimationStart={onAnimationStart}
            onAnimationComplete={onAnimationComplete}
        >
            <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    p: ({ children, id }) => {
                        return (
                            <TypewriterInternal
                                key={id}
                                children={children}
                                letterVariants={letterVariants}
                                scrollOnLastItem={scroll}
                                dadElement={(children) => {
                                    if (Array.isArray(children)) {
                                        children.push(<motion.span key={`span-${id}`} />);
                                        return children;
                                    }
                                    return children;
                                }}
                            />
                        );
                    },
                    a: ({ children, href, style, id }) => {
                        return (
                            <TypewriterInternal
                                key={id}
                                children={children}
                                letterVariants={letterVariants}
                                scrollOnLastItem={scroll}
                                dadElement={(children) => (
                                    <motion.a
                                        key={`a-${id}`}
                                        href={href}
                                        target='_blank'
                                        style={{
                                            ...style,
                                            color: useTheme().palette.primary[500],
                                        }}
                                        variants={letterVariants}
                                    >
                                        {children}
                                    </motion.a>
                                )}
                            />
                        );
                    },
                    code: ({ children, style, id }) => {
                        return (
                            <TypewriterInternal
                                key={id}
                                children={children}
                                letterVariants={letterVariants}
                                scrollOnLastItem={scroll}
                                dadElement={(children) => (
                                    <motion.code
                                        key={`code-${id}`}
                                        style={{
                                            ...style,
                                            backgroundColor: useTheme().palette.neutral[600],
                                            color: useTheme().palette.neutral[200],
                                        }}
                                        variants={letterVariants}
                                    >
                                        {children}
                                    </motion.code>
                                )}
                            />
                        );
                    },
                    ul: ({ children, style, id }) => {
                        return (
                            <TypewriterInternal
                                key={id}
                                children={children}
                                letterVariants={letterVariants}
                                scrollOnLastItem={scroll}
                                dadElement={(children) => (
                                    <motion.ul
                                        key={`ul-${id}`}
                                        style={{
                                            ...style,
                                            margin: 0,
                                        }}
                                        variants={letterVariants}
                                    >
                                        {children}
                                    </motion.ul>
                                )}
                            />
                        );
                    },
                    li: ({ children, style, id }) => {
                        return (
                            <TypewriterInternal
                                key={id}
                                children={children}
                                letterVariants={letterVariants}
                                scrollOnLastItem={scroll}
                                dadElement={(children) => (
                                    <motion.li key={`li-${id}`} style={style} variants={letterVariants}>
                                        {children}
                                    </motion.li>
                                )}
                            />
                        );
                    },
                    strong: ({ children, style, id }) => {
                        return (
                            <TypewriterInternal
                                key={id}
                                children={children}
                                letterVariants={letterVariants}
                                scrollOnLastItem={scroll}
                                dadElement={(children) => (
                                    <motion.strong key={`strong-${id}`} style={style} variants={letterVariants}>
                                        {children}
                                    </motion.strong>
                                )}
                            />
                        );
                    },
                    em: ({ children, style, id }) => {
                        return (
                            <TypewriterInternal
                                key={id}
                                children={children}
                                letterVariants={letterVariants}
                                scrollOnLastItem={scroll}
                                dadElement={(children) => (
                                    <motion.em key={`em-${id}`} style={style} variants={letterVariants}>
                                        {children}
                                    </motion.em>
                                )}
                            />
                        );
                    },
                    hr: ({ style, id }) => {
                        return <motion.hr key={id} style={style} variants={letterVariants} />;
                    },
                    th: ({ children, style, id }) => {
                        return (
                            <TypewriterInternal
                                key={id}
                                children={children}
                                letterVariants={letterVariants}
                                scrollOnLastItem={scroll}
                                dadElement={(children) => (
                                    <motion.th key={`th-${id}`} style={style} variants={letterVariants}>
                                        {children}
                                    </motion.th>
                                )}
                            />
                        );
                    },
                    del: ({ children, style, id }) => {
                        return (
                            <TypewriterInternal
                                key={id}
                                children={children}
                                letterVariants={letterVariants}
                                scrollOnLastItem={scroll}
                                dadElement={(children) => (
                                    <motion.del key={`del-${id}`} style={style} variants={letterVariants}>
                                        {children}
                                    </motion.del>
                                )}
                            />
                        );
                    },
                    table: ({ children, style, id }) => {
                        return (
                            <TypewriterInternal
                                key={id}
                                children={children}
                                letterVariants={letterVariants}
                                scrollOnLastItem={scroll}
                                dadElement={(children) => (
                                    <motion.table key={`table-${id}`} style={style} variants={letterVariants}>
                                        {children}
                                    </motion.table>
                                )}
                            />
                        );
                    },
                    span: ({ children, style, id }) => {
                        return (
                            <TypewriterInternal
                                key={id}
                                children={children}
                                letterVariants={letterVariants}
                                scrollOnLastItem={scroll}
                                dadElement={(children) => (
                                    <motion.span key={`span-${id}`} style={style} variants={letterVariants}>
                                        {children}
                                    </motion.span>
                                )}
                            />
                        );
                    },
                    h1: ({ children, style, id }) => {
                        return (
                            <TypewriterInternal
                                key={id}
                                children={children}
                                letterVariants={letterVariants}
                                scrollOnLastItem={scroll}
                                dadElement={(children) => (
                                    <motion.h1
                                        key={`h1-${id}`}
                                        style={{
                                            ...style,
                                            margin: 0,
                                        }}
                                        variants={letterVariants}
                                    >
                                        {children}
                                    </motion.h1>
                                )}
                            />
                        );
                    },
                    h2: ({ children, style, id }) => {
                        return (
                            <TypewriterInternal
                                key={id}
                                children={children}
                                letterVariants={letterVariants}
                                scrollOnLastItem={scroll}
                                dadElement={(children) => (
                                    <motion.h2
                                        key={`h2-${id}`}
                                        style={{
                                            ...style,
                                            margin: 0,
                                        }}
                                        variants={letterVariants}
                                    >
                                        {children}
                                    </motion.h2>
                                )}
                            />
                        );
                    },
                    h3: ({ children, style, id }) => {
                        return (
                            <TypewriterInternal
                                key={id}
                                children={children}
                                letterVariants={letterVariants}
                                scrollOnLastItem={scroll}
                                dadElement={(children) => (
                                    <motion.h3
                                        key={`h3-${id}`}
                                        style={{
                                            ...style,
                                            margin: 0,
                                        }}
                                        variants={letterVariants}
                                    >
                                        {children}
                                    </motion.h3>
                                )}
                            />
                        );
                    },
                    h4: ({ children, style, id }) => {
                        return (
                            <TypewriterInternal
                                key={id}
                                children={children}
                                letterVariants={letterVariants}
                                scrollOnLastItem={scroll}
                                dadElement={(children) => (
                                    <motion.h4
                                        key={`h4-${id}`}
                                        style={{
                                            ...style,
                                            margin: 0,
                                        }}
                                        variants={letterVariants}
                                    >
                                        {children}
                                    </motion.h4>
                                )}
                            />
                        );
                    },
                }}
            >
                {text}
            </Markdown>
        </motion.span>
    );
}
