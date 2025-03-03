import { ForwardRefComponent, HTMLMotionProps, motion, Variants } from "motion/react";
import { ClassAttributes, ElementType, HTMLAttributes, Key, ReactElement, RefObject, useMemo, useRef } from "react";
import Markdown, { Components, ExtraProps, Options } from "react-markdown";

function TypewriterInternal({
    children,
    className,
    characterVariants,
    dadElement,
    onCharacterAnimationComplete,
    key,
}: {
    children: any;
    className?: string;
    characterVariants: Variants;
    dadElement: (children: ReactElement | ReactElement[], isString?: boolean) => ReactElement | ReactElement[];
    isRoot?: boolean;
    onCharacterAnimationComplete?: (letterRef: RefObject<HTMLSpanElement | null>) => void;
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
                    variants={characterVariants}
                    onAnimationComplete={
                        onCharacterAnimationComplete
                            ? () => {
                                  onCharacterAnimationComplete(ref);
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
                            variants={characterVariants}
                            onAnimationComplete={
                                onCharacterAnimationComplete
                                    ? () => {
                                          onCharacterAnimationComplete(ref);
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
        onCharacterAnimationComplete?: (letterRef: RefObject<HTMLSpanElement | null>) => void;
        motionProps?: Omit<HTMLMotionProps<"span">, "variants">;
        characterVariants?: Variants;
    } & Omit<Options, "components">
) {
    const {
        delay = 10,
        onCharacterAnimationComplete,
        children: text,
        motionProps = {},
        characterVariants: letterVariantsProp = {
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
    const characterVariants = useMemo<Variants>(() => letterVariantsProp, [delay]);
    const components = useMemo(
        () =>
            MarkdownTypewriterComponents({
                characterVariants,
                onCharacterAnimationComplete,
                delay,
            }),
        [characterVariants, onCharacterAnimationComplete]
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
    characterVariants,
    onCharacterAnimationComplete,
    delay,
}: {
    characterVariants: Variants;
    onCharacterAnimationComplete?: (letterRef: RefObject<HTMLSpanElement | null>) => void;
    delay: number;
}): Components {
    let res: Components = {};
    const sentenceVariants = {
        hidden: characterVariants.hidden,
        visible: {
            ...characterVariants,
            opacity: 1,
            transition: { staggerChildren: delay / 1000 },
        },
    };
    htmlTags.forEach((tag) => {
        try {
            let MotionComponent: ForwardRefComponent<HTMLHeadingElement, HTMLMotionProps<any>> = (motion as any)[tag];
            if (MotionComponent) {
                let fn: ElementType<
                    ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement> & ExtraProps
                > = (props) => {
                    const { children, id, className } = props;
                    switch (tag) {
                        case "table":
                            return (
                                <MotionComponent
                                    {...props}
                                    key={`${tag}-${id}`}
                                    variants={className ? undefined : sentenceVariants}
                                    onAnimationComplete={onCharacterAnimationComplete}
                                >
                                    {children}
                                </MotionComponent>
                            );
                        case "tr":
                        case "th":
                        case "td":
                            return <MotionComponent {...props}>{children}</MotionComponent>;
                        case "p":
                            return (
                                <TypewriterInternal
                                    key={id}
                                    children={children}
                                    characterVariants={characterVariants}
                                    onCharacterAnimationComplete={onCharacterAnimationComplete}
                                    dadElement={(children) => {
                                        if (Array.isArray(children)) {
                                            children.push(<motion.span key={`span-${id}`} />);
                                            return children;
                                        }
                                        return children;
                                    }}
                                />
                            );
                        case "span":
                            return (
                                <TypewriterInternal
                                    key={id}
                                    children={children}
                                    characterVariants={characterVariants}
                                    onCharacterAnimationComplete={onCharacterAnimationComplete}
                                    dadElement={(children) => {
                                        if (Array.isArray(children)) {
                                            return (
                                                <MotionComponent {...props} key={`${tag}-${id}`} children={children} />
                                            );
                                        }
                                        return children;
                                    }}
                                />
                            );
                        default:
                            return (
                                <TypewriterInternal
                                    key={id}
                                    children={children}
                                    characterVariants={characterVariants}
                                    onCharacterAnimationComplete={onCharacterAnimationComplete}
                                    dadElement={(children, isString) => {
                                        return (
                                            <MotionComponent
                                                {...props}
                                                key={`${tag}-${id}`}
                                                variants={isString || className ? undefined : sentenceVariants}
                                            >
                                                {children}
                                            </MotionComponent>
                                        );
                                    }}
                                />
                            );
                    }
                };
                (res as any)[tag] = fn;
            }
        } catch (_) {}
    });
    return res;
}
