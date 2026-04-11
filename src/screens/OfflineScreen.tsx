import SignalWifiBadIcon from "@mui/icons-material/SignalWifiBad";
import { Box } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import { useStore } from "@tanstack/react-store";
import useNetworkDetector from "../hooks/useNetworkDetector";
import { NetworkStore } from "../lib/stores/useNetworkStore";

export default function OfflineScreen() {
    useNetworkDetector();
    const open = useStore(NetworkStore.store, (state) => !state.isOnline);

    return (
        <Modal
            keepMounted
            open={open}
            className="animate-in blur-in-md fade-in-0"
            sx={{
                backdropFilter: "blur(10px)",
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
                    color="error"
                    sx={{
                        fontSize: "1000%",
                    }}
                />
            </Box>
        </Modal>
    );
}
