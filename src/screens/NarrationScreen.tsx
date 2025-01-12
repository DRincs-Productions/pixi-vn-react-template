import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { motion, Variants } from "motion/react";
import { useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import SliderResizer from '../components/SliderResizer';
import TypewriterList from '../components/TypewriterList';
import useDialogueCardStore from '../stores/useDialogueCardStore';
import useInterfaceStore from '../stores/useInterfaceStore';
import useTypewriterStore from '../stores/useTypewriterStore';
import { useQueryDialogue } from '../use_query/useQueryInterface';
import ChoiceMenu from './ChoiceMenu';

export default function NarrationScreen() {
    const { height: cardHeight, setHeight: setCardHeight, imageWidth: cardImageWidth, setImageWidth: setCardImageWidth } = useDialogueCardStore(
        useShallow((state) => (state)),
    )
    const typewriterDelay = useTypewriterStore((state) => state.delay)
    const startTypewriter = useTypewriterStore((state) => state.start)
    const endTypewriter = useTypewriterStore((state) => state.end)
    const { data: { text, character } = {} } = useQueryDialogue()
    const hidden = useInterfaceStore((state) => state.hidden || (text ? false : true));
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
        },
        closed: {
            opacity: 0,
            x: -100,
        }
    }
    const paragraphRef = useRef<HTMLDivElement>(null);

    return (
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
            <ChoiceMenu
                fullscreen={text ? false : true}
            />
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
                variants={cardVarians}
                initial={"closed"}
                animate={hidden ? "closed" : "open"}
                exit={"closed"}
                transition={{ type: "tween" }}
            />
            <Box
                sx={{
                    position: "absolute",
                    height: `${cardHeight}%`,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            >
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
                        {character?.icon && <AspectRatio
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
                                src={character.icon}
                                loading="lazy"
                                alt=""
                            />
                        </AspectRatio>}
                        {character &&
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
                                variants={cardImageVarians}
                                initial={"closed"}
                                animate={character?.icon ? "open" : "closed"}
                                exit={"closed"}
                                transition={{ type: "tween" }}
                            />
                        }
                        <CardContent>
                            {character && character.name && <Typography
                                fontSize="xl"
                                fontWeight="lg"
                                sx={{
                                    color: character.color,
                                    paddingLeft: 1,
                                }}
                                component={motion.div}
                                variants={cardElementVarians}
                                initial={"closed"}
                                animate={character.name ? "open" : "closed"}
                                exit={"closed"}
                            >
                                {character.name + (character.surname ? " " + character.surname : "")}
                            </Typography>}
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
                                <TypewriterList
                                    text={text || ""}
                                    delay={typewriterDelay}
                                    onAnimationStart={startTypewriter}
                                    onAnimationComplete={endTypewriter}
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
            </Box>
        </Box>
    );
}
