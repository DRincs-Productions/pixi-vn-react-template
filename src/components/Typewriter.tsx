import { ForwardRefComponent, HTMLMotionProps, motion, Variants } from "motion/react";
import { ClassAttributes, ElementType, HTMLAttributes, Key, ReactElement, useMemo, useRef } from "react";
import Markdown, { Components, ExtraProps } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

function TypewriterInternal({
    children,
    className,
    letterVariants,
    dadElement,
    scrollOnLastItem,
    key,
}: {
    children: any;
    className?: string;
    letterVariants: Variants;
    dadElement: (children: ReactElement | ReactElement[], isString?: boolean) => ReactElement | ReactElement[];
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
                    className={className}
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
        return dadElement(spanList, true);
    } else if (Array.isArray(children)) {
        const list = children.map((child) => {
            if (typeof child === "string") {
                let spanList = child.split("").map((char, i) => {
                    const ref = useRef<HTMLSpanElement>(null);
                    return (
                        <motion.span
                            ref={ref}
                            className={className}
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
    return dadElement(children, true);
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
    const cccc = useMemo(
        () =>
            AAA({
                letterVariants,
                scroll,
            }),
        [letterVariants, scroll]
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
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={cccc}>
                {text}
            </Markdown>
        </motion.span>
    );
}

import htmlTags from "html-tags";

function AAA({
    letterVariants,
    scroll,
}: {
    letterVariants: Variants;
    scroll?: (offsetTop: number) => void;
}): Components {
    let res: Components = {};
    htmlTags.forEach((tag) => {
        try {
            let Test: ForwardRefComponent<HTMLHeadingElement, HTMLMotionProps<any>> = (motion as any)[tag];
            if (Test) {
                let fn: ElementType<
                    ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement> & ExtraProps
                > = (props) => {
                    const { children, style, id } = props;
                    if (tag == "p") {
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
                    }
                    return (
                        <TypewriterInternal
                            key={id}
                            children={children}
                            // className={className}
                            letterVariants={letterVariants}
                            scrollOnLastItem={scroll}
                            dadElement={(children, isString) => {
                                return (
                                    <Test
                                        key={`${tag}-${id}`}
                                        style={style}
                                        // className={className}
                                        variants={
                                            isString
                                                ? undefined
                                                : letterVariants && {
                                                      hidden: letterVariants.hidden,
                                                      visible: {
                                                          ...letterVariants,
                                                          opacity: 1,
                                                          transition: { staggerChildren: 20 / 1000 },
                                                      },
                                                  }
                                        }
                                    >
                                        {children}
                                    </Test>
                                );
                            }}
                        />
                    );
                };
                (res as any)[tag] = fn;
            }
        } catch (_) {}
    });
    return res;
}
