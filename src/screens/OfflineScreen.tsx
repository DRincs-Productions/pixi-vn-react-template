import SignalWifiBadIcon from "@mui/icons-material/SignalWifiBad";
import { Box } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import { AnimatePresence, motion } from "motion/react";
import useNetworkStore from "../stores/useNetworkStore";

export default function OfflineScreen() {
    const open = useNetworkStore((state) => !state.isOnline);

    return (
        <AnimatePresence>
            <Modal
                keepMounted
                open={open}
                component={motion.div}
                variants={{
                    open: {
                        opacity: 1,
                        pointerEvents: "auto",
                        backdropFilter: "blur(8px)",
                    },
                    closed: {
                        opacity: 0,
                        pointerEvents: "none",
                        backdropFilter: "blur(0px)",
                    },
                }}
                initial={"closed"}
                animate={open ? "open" : "closed"}
                exit={"closed"}
                transition={{
                    duration: 0.4,
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "20%",
                    }}
                >
                    <SignalWifiBadIcon
                        color='error'
                        sx={{
                            fontSize: "1000%",
                        }}
                    />
                </Box>
            </Modal>
        </AnimatePresence>
    );
}
