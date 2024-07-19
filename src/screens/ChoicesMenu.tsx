import { ChoiceMenuOption, ChoiceMenuOptionClose, clearChoiceMenuOptions, GameStepManager } from '@drincs/pixi-vn';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { Box, Grid } from '@mui/joy';
import { motion, Variants } from "framer-motion";
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { choiceMenuState } from '../atoms/choiceMenuState';
import { dialogueCardHeightState } from '../atoms/dialogueCardHeightState';
import { reloadInterfaceDataEventState } from '../atoms/reloadInterfaceDataEventState';
import ChoiceButton from '../components/ChoiceButton';
import { useMyNavigate } from '../utility/useMyNavigate';

type IProps = {
    fullscreen?: boolean,
}

export default function ChoicesMenu(props: IProps) {
    const {
        fullscreen = true,
    } = props;
    const [loading, setLoading] = useState(false)
    const marginButton = useRecoilValue(dialogueCardHeightState)
    const height = 100 - marginButton
    const { t } = useTranslation(["translation"]);
    const navigate = useMyNavigate();
    const { menu, hidden } = useRecoilValue(choiceMenuState)
    const notifyReloadInterfaceDataEvent = useSetRecoilState(reloadInterfaceDataEventState);
    const { enqueueSnackbar } = useSnackbar();
    const itemVariants: Variants = {
        open: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        },
        closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
    };

    function afterSelectChoice(item: ChoiceMenuOptionClose | ChoiceMenuOption<{}>) {
        setLoading(true)
        clearChoiceMenuOptions()
        if (item.type == "call") {
            GameStepManager.callLabel(item.label, {
                navigate: navigate,
                t: t,
                notify: (message, variant) => enqueueSnackbar(message, { variant }),
                ...item.props
            })
                .then(() => {
                    notifyReloadInterfaceDataEvent((prev) => prev + 1)
                    setLoading(false)
                })
                .catch((e) => {
                    setLoading(false)
                    console.error(e)
                })
        }
        else if (item.type == "jump") {
            GameStepManager.jumpLabel(item.label, {
                navigate: navigate,
                t: t,
                notify: (message, variant) => enqueueSnackbar(message, { variant }),
                ...item.props
            })
                .then(() => {
                    notifyReloadInterfaceDataEvent((prev) => prev + 1)
                    setLoading(false)
                })
                .catch((e) => {
                    setLoading(false)
                    console.error(e)
                })
        }
        else if (item.type == "close") {
            GameStepManager.closeChoiceMenu(item, {
                navigate: navigate,
                t: t,
                notify: (message, variant) => enqueueSnackbar(message, { variant }),
                ...item.props
            })
                .then(() => {
                    notifyReloadInterfaceDataEvent((prev) => prev + 1)
                    setLoading(false)
                })
                .catch((e) => {
                    setLoading(false)
                    console.error(e)
                })
        }
        else {
            setLoading(false)
            console.error("Unsupported label run mode")
        }
    }

    return (
        <Box
            sx={{
                width: '100%',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: fullscreen ? "100%" : `${height}%`,
                pointerEvents: "auto",
            }}
            component={motion.div}
            initial="closed"
            animate={hidden ? "openclosed" : "open"}
            exit="closed"
            className="menu"
        >
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{
                    overflow: 'auto',
                    height: "100%",
                    gap: 1,
                    width: '100%',
                }}
                component={motion.div}
                variants={{
                    open: {
                        clipPath: "inset(0% 0% 0% 0% round 10px)",
                        transition: {
                            type: "spring",
                            bounce: 0,
                            duration: 0.7,
                            staggerChildren: 0.05
                        }
                    },
                    closed: {
                        clipPath: "inset(10% 50% 90% 50% round 10px)",
                        transition: {
                            type: "spring",
                            bounce: 0,
                            duration: 0.3
                        }
                    }
                }}
            >
                {menu?.map((item, index) => {
                    return (
                        <Grid
                            key={"choice-" + index}
                            justifyContent="center"
                            alignItems="center"
                            component={motion.div}
                            variants={itemVariants}
                        >
                            <ChoiceButton
                                loading={loading}
                                onClick={() => {
                                    afterSelectChoice(item)
                                }}
                                sx={{
                                    left: 0,
                                    right: 0,
                                }}
                                startDecorator={item.type == "close" ? <KeyboardReturnIcon /> : undefined}
                            >
                                {item.text}
                            </ChoiceButton>
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    );
}
