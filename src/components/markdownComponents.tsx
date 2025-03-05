import htmlTags from "html-tags";
import { ForwardRefComponent, HTMLMotionProps, motion, Variants } from "motion/react";
import { ClassAttributes, ElementType, HTMLAttributes, RefObject } from "react";
import { Components, ExtraProps } from "react-markdown";
import TypewriterItem from "../components/TypewriterItem";

export default function markdownComponents({
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
                        case "input":
                        case "hr":
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
                                <TypewriterItem
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
                                <TypewriterItem
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
                                <TypewriterItem
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
