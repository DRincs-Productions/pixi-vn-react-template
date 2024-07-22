import { StepLabelProps } from '@drincs/pixi-vn/dist/override';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useRef } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { dialogDataState } from '../atoms/dialogDataState';
import { dialogueCardHeightState } from '../atoms/dialogueCardHeightState';
import { dialogueCardImageWidthState } from '../atoms/dialogueCardImageWidthState';
import { typewriterDelayState } from '../atoms/typewriterDelayState';
import { typewriterIsAnimatedState } from '../atoms/typewriterIsAnimatedState';
import SliderResizer from '../components/SliderResizer';
import TypewriterMarkdown from '../components/TypewriterMarkdown';
import ChoicesMenu from './ChoicesMenu';
import NextButton from './NextButton';

export default function Dialogue({ nextOnClick }: {
    nextOnClick: (props: StepLabelProps) => void,
}) {
    const [cardHeight, setCardHeight] = useRecoilState(dialogueCardHeightState)
    const [cardImageWidth, setCardImageWidth] = useRecoilState(dialogueCardImageWidthState)
    const typewriterDelay = useRecoilValue(typewriterDelayState)
    const { text, character, hidden } = useRecoilValue(dialogDataState)
    const setTypewriterIsAnimated = useSetRecoilState(typewriterIsAnimatedState)
    const cardVarians: Variants = {
        open: {
            opacity: 1,
            y: 0,
        },
        closed: {
            opacity: 0,
            y: 200,
            pointerEvents: "none",
        }
    }
    const cardElementVarians: Variants = {
        open: {
            opacity: 1,
            scale: 1,
            pointerEvents: "auto",
        },
        closed: {
            opacity: 0,
            scale: 0,
            pointerEvents: "none",
        }
    }
    const cardImageVarians: Variants = {
        open: {
            opacity: 1,
            x: 0,
            pointerEvents: "auto",
        },
        closed: {
            opacity: 0,
            x: -100,
            pointerEvents: "none",
        }
    }
    const paragraphRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <Box
                sx={{
                    height: '95%',
                    width: '100%',
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                }}
            >
                <ChoicesMenu
                    fullscreen={text ? false : true}
                />
                <Box
                    sx={{
                        height: '100%',
                    }}
                    component={motion.div}
                    variants={cardVarians}
                    initial={"closed"}
                    animate={hidden ? "closed" : "open"}
                    exit={"closed"}
                    transition={{ type: "tween" }}
                >
                    <SliderResizer
                        orientation="vertical"
                        max={100}
                        min={0}
                        value={cardHeight}
                        onChange={(_, value) => {
                            if (typeof value === "number") {
                                setCardHeight(value)
                            }
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        position: "absolute",
                        height: `${cardHeight}%`,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                >
                    <AnimatePresence>
                        <Box
                            sx={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                top: 0,
                                height: "100%",
                            }}
                            component={motion.div}
                            variants={cardVarians}
                            initial={"closed"}
                            animate={hidden ? "closed" : "open"}
                            exit={"closed"}
                            transition={{ type: "tween" }}
                        >
                            <Card
                                key={"dialogue-card"}
                                orientation="horizontal"
                                sx={{
                                    overflow: 'auto',
                                    gap: 1,
                                    padding: 0,
                                    height: "100%",
                                }}
                            >
                                {character && <AspectRatio
                                    flex
                                    ratio="1"
                                    maxHeight={"20%"}
                                    sx={{
                                        height: "100%",
                                        minWidth: `${cardImageWidth}%`,
                                    }}
                                    component={motion.div}
                                    variants={cardElementVarians}
                                    initial={"closed"}
                                    animate={character?.icon ? "open" : "closed"}
                                    exit={"closed"}
                                    transition={{ type: "tween" }}
                                >
                                    <img
                                        src={character?.icon}
                                        loading="lazy"
                                        alt=""
                                    />
                                </AspectRatio>}
                                {character && <Box
                                    component={motion.div}
                                    variants={cardImageVarians}
                                    initial={"closed"}
                                    animate={character?.icon ? "open" : "closed"}
                                    exit={"closed"}
                                    transition={{ type: "tween" }}
                                >
                                    <SliderResizer
                                        orientation="horizontal"
                                        max={100}
                                        min={0}
                                        value={cardImageWidth}
                                        onChange={(_, value) => {
                                            if (typeof value === "number") {
                                                if (value > 75) {
                                                    value = 75
                                                }
                                                if (value < 5) {
                                                    value = 5
                                                }
                                                setCardImageWidth(value)
                                            }
                                        }}
                                    />
                                </Box>}
                                <CardContent>
                                    <AnimatePresence>
                                        {character && character.name && <Typography
                                            fontSize="xl"
                                            fontWeight="lg"
                                            sx={{
                                                color: character.color,
                                            }}
                                            component={motion.div}
                                            variants={cardElementVarians}
                                            initial={"closed"}
                                            animate={character.name ? "open" : "closed"}
                                            exit={"closed"}
                                        >
                                            {character.name + (character.surname ? " " + character.surname : "")}
                                        </Typography>}
                                    </AnimatePresence>
                                    <Sheet
                                        ref={paragraphRef}
                                        sx={{
                                            bgcolor: 'background.level1',
                                            borderRadius: 'sm',
                                            p: 1.5,
                                            minHeight: 10,
                                            display: 'flex',
                                            flex: 1,
                                            overflow: 'auto',
                                            height: "100%",
                                            marginRight: 2,
                                            marginBottom: 2,
                                        }}
                                    >
                                        <TypewriterMarkdown
                                            text={text || ""}
                                            delay={typewriterDelay}
                                            onAnimationStart={() => setTypewriterIsAnimated(true)}
                                            onAnimationComplete={() => setTypewriterIsAnimated(false)}
                                            scroll={typewriterDelay ? (offsetTop: number) => {
                                                if (paragraphRef.current) {
                                                    let scrollTop = (offsetTop - (paragraphRef.current.clientHeight / 2))
                                                    paragraphRef.current.scrollTo({ top: scrollTop, behavior: "auto" })
                                                }
                                            } : undefined}
                                        />
                                    </Sheet>
                                </CardContent>
                            </Card>
                        </Box>
                        <NextButton
                            nextOnClick={nextOnClick}
                        />
                    </AnimatePresence>
                </Box>
            </Box>
        </>
    );
}
