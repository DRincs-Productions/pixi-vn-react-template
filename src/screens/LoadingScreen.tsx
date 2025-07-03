import { Box, CircularProgress } from "@mui/joy";

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
                className='motion-preset-pop'
            >
                <CircularProgress />
            </Box>
        </Box>
    );
}
