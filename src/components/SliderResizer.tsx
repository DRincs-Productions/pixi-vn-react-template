import { Slider, SliderProps, Stack, useTheme } from "@mui/joy";
import { AnimationProps, motion } from "framer-motion";

interface SliderResizerProps extends SliderProps, AnimationProps { }

export default function SliderResizer(props: SliderResizerProps) {
    const {
        orientation,
        sx,
        key,
        ...rest
    } = props;

    return (
        <Stack
            key={"stack-" + key}
            direction={orientation === "vertical" ? "row" : "column"}
            justifyContent="center"
            alignItems="center"
            spacing={0}
            sx={{
                pointerEvents: "none",
                width: '100%',
                height: '100%',
                position: "absolute",
                left: 0,
                right: 0,
            }}
        >
            <Slider
                key={key}
                orientation={orientation}
                valueLabelDisplay="auto"
                valueLabelFormat={(index) => index + "%"}
                sx={{
                    position: "static",
                    zIndex: useTheme().zIndex.table + 1,
                    "--Slider-trackSize": "0px",
                    "--Slider-thumbWidth": orientation === "vertical" ? "42px" : "16px",
                    "--Slider-thumbSize": orientation === "vertical" ? "16px" : "42px",
                    "& .MuiSlider-thumb": {
                        cursor: orientation === "vertical" ? "row-resize" : "col-resize",
                        pointerEvents: "auto",
                    },
                    ...sx,
                    pointerEvents: "none",
                }}
                component={motion.div}
                {...rest}
            />
        </Stack>
    );
}
