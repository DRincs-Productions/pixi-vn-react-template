import { ForwardRefComponent, HTMLMotionProps, motion, Variants } from "motion/react";
import { ClassAttributes, ElementType, HTMLAttributes, Key, ReactElement, RefObject, useMemo, useRef } from "react";
import Markdown, { Components, ExtraProps, Options } from "react-markdown";

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

export default function MarkdownTypewriter(
    props: {
        delay?: number;
        scrollRef?: RefObject<HTMLDivElement | null>;
        motionProps?: Omit<HTMLMotionProps<"span">, "variants">;
        letterVariants?: Variants;
    } & Omit<Options, "components">
) {
    const {
        delay = 10,
        scrollRef,
        children: text,
        motionProps = {},
        letterVariants: letterVariantsProp = {
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { opacity: { duration: 0 } } },
        },
        ...rest
    } = props;
    const sentenceVariants = useMemo<Variants>(
        () => ({
            hidden: {},
            visible: { opacity: 1, transition: { staggerChildren: delay / 1000 } },
        }),
        [delay]
    );
    const letterVariants = useMemo<Variants>(() => letterVariantsProp, [delay]);
    const components = useMemo(
        () =>
            MarkdownTypewriterComponents({
                letterVariants,
                scrollRef,
            }),
        [letterVariants, scrollRef]
    );

    return (
        <motion.span
            key={`typewriter-internal-${text}`}
            variants={sentenceVariants}
            initial='hidden'
            animate={"visible"}
            {...motionProps}
        >
            <Markdown {...rest} components={components}>
                {text}
            </Markdown>
        </motion.span>
    );
}

import htmlTags from "html-tags";

function MarkdownTypewriterComponents({
    letterVariants,
    scrollRef,
}: {
    letterVariants: Variants;
    scrollRef?: RefObject<HTMLDivElement | null>;
}): Components {
    const scroll = (offsetTop: number) => {
        if (scrollRef && scrollRef.current) {
            let scrollTop = offsetTop - scrollRef.current.clientHeight / 2;
            scrollRef.current.scrollTo({
                top: scrollTop,
                behavior: "auto",
            });
        }
    };
    let res: Components = {};
    htmlTags.forEach((tag) => {
        try {
            let MotionComponent: ForwardRefComponent<HTMLHeadingElement, HTMLMotionProps<any>> = (motion as any)[tag];
            if (MotionComponent) {
                let fn: ElementType<
                    ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement> & ExtraProps
                > = (props) => {
                    const { children, id, className } = props;
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
                            letterVariants={letterVariants}
                            scrollOnLastItem={scroll}
                            dadElement={(children, isString) => {
                                return (
                                    <MotionComponent
                                        {...props}
                                        key={`${tag}-${id}`}
                                        variants={
                                            isString || className
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
                                    </MotionComponent>
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
