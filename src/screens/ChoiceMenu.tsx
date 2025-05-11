import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Box, Grid } from "@mui/joy";
import { motion, Variants } from "motion/react";
import ChoiceButton from "../components/ChoiceButton";
import useNarrationFunctions from "../hooks/useNarrationFunctions";
import useDialogueCardStore from "../stores/useDialogueCardStore";
import useInterfaceStore from "../stores/useInterfaceStore";
import useStepStore from "../stores/useStepStore";
import { useQueryChoiceMenuOptions } from "../use_query/useQueryInterface";

export default function ChoiceMenu({ fullscreen = true }: { fullscreen?: boolean }) {
    const nextStepLoading = useStepStore((state) => state.loading);
    const height = useDialogueCardStore((state) => 100 - state.height);
    const { data: menu = [] } = useQueryChoiceMenuOptions();
    const hidden = useInterfaceStore((state) => state.hidden || menu.length == 0);
    const { selectChoice } = useNarrationFunctions();
    const gridVariants: Variants = {
        open: {
            clipPath: "inset(0% 0% 0% 0% round 10px)",
            transition: {
                type: "spring",
                bounce: 0,
                duration: 0.7,
                staggerChildren: 0.05,
            },
        },
        closed: {
            clipPath: "inset(10% 50% 90% 50% round 10px)",
            transition: {
                type: "spring",
                bounce: 0,
                duration: 0.3,
            },
        },
    };
    const itemVariants: Variants = {
        open: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 },
        },
        closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
    };

    return (
        <Box
            sx={{
                width: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: fullscreen ? "100%" : `${height}%`,
                pointerEvents: hidden ? "none" : "auto",
            }}
        >
            <Grid
                container
                direction='column'
                justifyContent='center'
                alignItems='center'
                spacing={2}
                sx={{
                    overflow: "auto",
                    height: "100%",
                    gap: 1,
                    width: "100%",
                }}
                component={motion.div}
                variants={gridVariants}
                animate={hidden ? "closed" : "open"}
            >
                {menu?.map((item, index) => {
                    return (
                        <Grid
                            key={"choice-" + index}
                            justifyContent='center'
                            alignItems='center'
                            component={motion.div}
                            variants={itemVariants}
                        >
                            <ChoiceButton
                                loading={nextStepLoading}
                                onClick={() => selectChoice(item)}
                                sx={{
                                    left: 0,
                                    right: 0,
                                }}
                                startDecorator={item.type == "close" ? <KeyboardReturnIcon /> : undefined}
                            >
                                {item.text}
                            </ChoiceButton>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}
