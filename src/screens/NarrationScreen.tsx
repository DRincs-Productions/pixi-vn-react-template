import { useColorScheme } from "@mui/joy";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import { RefObject, useCallback, useMemo, useRef } from "react";
import Markdown from "react-markdown";
import { MarkdownTypewriterHooks } from "react-markdown-typewriter";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useShallow } from "zustand/react/shallow";
import AnimatedDots from "../components/AnimatedDots";
import SliderResizer from "../components/SliderResizer";
import { useQueryDialogue } from "../hooks/useQueryInterface";
import useDialogueCardStore from "../stores/useDialogueCardStore";
import useInterfaceStore from "../stores/useInterfaceStore";
import useTypewriterStore from "../stores/useTypewriterStore";
import ChoiceMenu from "./ChoiceMenu";

export default function NarrationScreen() {
    const {
        height: cardHeightTemp,
        setHeight: setCardHeight,
        imageWidth: cardImageWidth,
        setImageWidth: setCardImageWidth,
    } = useDialogueCardStore(useShallow((state) => state));
    const { data: { animatedText, character, text } = {} } = useQueryDialogue();
    const hidden = useInterfaceStore((state) => state.hidden || (animatedText || text ? false : true));
    const cardHeight = animatedText || text ? cardHeightTemp : 0;
    const cardVarians = useMemo(
        () =>
            hidden
                ? `motion-opacity-out-0 motion-translate-y-out-[50%]`
                : `motion-opacity-in-0 motion-translate-y-in-[50%]`,
        [hidden]
    );
    const sliderVarians = useMemo(
        () =>
            hidden
                ? `motion-duration-200/opacity motion-opacity-out-0 motion-translate-y-out-[25%]`
                : `motion-opacity-in-0 motion-translate-y-in-[25%]`,
        [hidden]
    );
    const cardImageVarians = useMemo(
        () => (!hidden && character?.icon ? `motion-opacity-in-0 motion-translate-x-in-[-5%]` : `motion-opacity-out-0`),
        [hidden, character?.icon]
    );
    const paragraphRef = useRef<HTMLDivElement>(null);

    return (
        <Box
            sx={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
            }}
        >
            <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                <SliderResizer
                    orientation='vertical'
                    max={100}
                    min={0}
                    value={cardHeight}
                    onChange={(_, value) => {
                        if (typeof value === "number") {
                            setCardHeight(value);
                        }
                    }}
                    stackProps={{
                        sx: {
                            top: 0,
                            paddingBottom: { xs: "0.9rem", sm: "1rem", md: "1.1rem", lg: "1.3rem", xl: "1.4rem" },
                        },
                    }}
                    sx={{
                        pointerEvents: !hidden ? "auto" : "none",
                    }}
                    className={sliderVarians}
                />
                <Box sx={{ flex: 1, minHeight: 0 }}>
                    <ChoiceMenu />
                </Box>
                <Box
                    sx={{
                        flex: "0 0 auto",
                        height: `${cardHeight}%`,
                        minHeight: 0,
                        pointerEvents: !hidden ? "auto" : "none",
                    }}
                    className={cardVarians}
                >
                    <Card
                        key={"dialogue-card"}
                        orientation='horizontal'
                        sx={{
                            overflow: "auto",
                            gap: 1,
                            padding: 0,
                            height: "100%",
                            marginX: { xs: "0.9rem", sm: "1rem", md: "1.1rem", lg: "1.3rem", xl: "1.4rem" },
                        }}
                    >
                        {character?.icon && (
                            <AspectRatio
                                flex
                                ratio='1'
                                maxHeight={"20%"}
                                sx={{
                                    height: "100%",
                                    minWidth: `${cardImageWidth}%`,
                                }}
                                className={`motion-scale-x-in-0`}
                            >
                                <img src={character.icon} loading='lazy' alt='' />
                            </AspectRatio>
                        )}
                        <SliderResizer
                            orientation='horizontal'
                            max={100}
                            min={0}
                            value={cardImageWidth}
                            onChange={(_, value) => {
                                if (typeof value === "number") {
                                    if (value > 75) {
                                        value = 75;
                                    }
                                    if (value < 5) {
                                        value = 5;
                                    }
                                    setCardImageWidth(value);
                                }
                            }}
                            sx={{
                                pointerEvents: !hidden && character?.icon ? "auto" : "none",
                            }}
                            className={cardImageVarians}
                        />
                        <CardContent>
                            <Typography
                                fontSize='xl'
                                fontWeight='lg'
                                sx={{
                                    color: character?.color,
                                    paddingLeft: 1,
                                    height: { sx: undefined, md: 30 },
                                    marginLeft: 2,
                                }}
                                className={
                                    character && character.name
                                        ? `motion-opacity-in-0 motion-translate-x-in-[-3%]`
                                        : `motion-opacity-out-0`
                                }
                            >
                                {`${character?.name || ""} ${character?.surname || ""}`}
                            </Typography>
                            <Sheet
                                ref={paragraphRef}
                                sx={{
                                    bgcolor: "background.level1",
                                    borderRadius: "sm",
                                    p: 1.5,
                                    minHeight: 10,
                                    display: "flex",
                                    flex: 1,
                                    overflow: "auto",
                                    height: "100%",
                                    marginX: { xs: 0, md: 3 },
                                    marginBottom: { xs: 0, md: 3 },
                                }}
                            >
                                <NarrationScreenText paragraphRef={paragraphRef} />
                            </Sheet>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
            <Box
                sx={{
                    flex: "0 0 auto",
                    height: { xs: "0.9rem", sm: "1rem", md: "1.1rem", lg: "1.3rem", xl: "1.4rem" },
                    minHeight: 0,
                }}
            />
        </Box>
    );
}

function NarrationScreenText({ paragraphRef }: { paragraphRef: RefObject<HTMLDivElement | null> }) {
    const typewriterDelay = useTypewriterStore(useShallow((state) => state.delay));
    const startTypewriter = useTypewriterStore(useShallow((state) => state.start));
    const endTypewriter = useTypewriterStore(useShallow((state) => state.end));
    const { data: { animatedText, text } = {} } = useQueryDialogue();
    const { mode } = useColorScheme();

    const handleCharacterAnimationComplete = useCallback((ref: { current: HTMLSpanElement | null }) => {
        if (paragraphRef.current && ref.current) {
            let scrollTop = ref.current.offsetTop - paragraphRef.current.clientHeight / 2;
            paragraphRef.current.scrollTo({
                top: scrollTop,
                behavior: "auto",
            });
        }
    }, []);

    return (
        <p
            className={`prose ${mode === "dark" ? "dark:prose-invert" : ""}`}
            style={{ margin: 0, padding: 0, maxWidth: "100%" }}
        >
            <span>
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        p: (props) => <span {...props} />,
                    }}
                >
                    {text}
                </Markdown>
            </span>
            <span>
                <span> </span>
                <MarkdownTypewriterHooks
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    delay={typewriterDelay}
                    motionProps={{
                        onAnimationStart: startTypewriter,
                        onAnimationComplete: (definition: "visible" | "hidden") => {
                            if (definition == "visible") {
                                endTypewriter();
                            }
                        },
                        onCharacterAnimationComplete: handleCharacterAnimationComplete,
                    }}
                    fallback={<AnimatedDots />}
                >
                    {animatedText}
                </MarkdownTypewriterHooks>
            </span>
        </p>
    );
}
