import { Box, CircularProgress } from "@mui/joy";
import { motion } from "motion/react";

export default function LoadingScreen() {
    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    margin: 2,
                }}
                component={motion.div}
                variants={{
                    open: {
                        opacity: 1,
                        scale: 1,
                        pointerEvents: "auto",
                    },
                    closed: {
                        opacity: 0,
                        scale: 0,
                        pointerEvents: "none",
                    },
                }}
                initial={"closed"}
                animate={"open"}
                exit={"closed"}
            >
                <CircularProgress />
            </Box>
        </Box>
    );
}
