import { Slider, SliderProps, Stack, useTheme } from "@mui/joy";

export default function SliderResizer(props: SliderProps) {
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
                sx={{
                    cursor: orientation === "vertical" ? "row-resize" : "col-resize",
                    position: "static",
                    pointerEvents: "none",
                    zIndex: useTheme().zIndex.table + 1,
                    "--Slider-trackSize": "0px",
                    "--Slider-thumbWidth": orientation === "vertical" ? "42px" : "16px",
                    "--Slider-thumbSize": orientation === "vertical" ? "16px" : "42px",
                    "& .MuiSlider-thumb": {
                        pointerEvents: "auto",
                    },
                    ...sx,
                }}
                {...rest}
            />
        </Stack>
    );
}
