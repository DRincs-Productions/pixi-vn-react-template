import { Slider, SliderProps, Stack, StackProps, useTheme } from "@mui/joy";

export default function SliderResizer(
    props: SliderProps & {
        stackProps?: StackProps;
    }
) {
    const { orientation, sx, key, stackProps, ...rest } = props;
    const { sx: stackSX, ...stackRest } = stackProps || {};
    const { pointerEvents } = (sx || {}) as any;

    return (
        <Stack
            key={"stack-" + key}
            direction={orientation === "vertical" ? "row" : "column"}
            justifyContent='center'
            alignItems='center'
            spacing={0}
            sx={{
                pointerEvents: "none",
                width: "100%",
                height: "100%",
                position: "absolute",
                left: 0,
                right: 0,
                ...stackSX,
            }}
            {...stackRest}
        >
            <Slider
                key={key}
                orientation={orientation}
                valueLabelDisplay='auto'
                valueLabelFormat={(index) => index + "%"}
                sx={{
                    zIndex: useTheme().zIndex.table + 1,
                    "--Slider-trackSize": "0px",
                    "--Slider-thumbWidth": orientation === "vertical" ? "42px" : "16px",
                    "--Slider-thumbSize": orientation === "vertical" ? "16px" : "42px",
                    "& .MuiSlider-thumb": {
                        cursor: orientation === "vertical" ? "row-resize" : "col-resize",
                        pointerEvents: pointerEvents ?? "auto",
                    },
                    ...sx,
                    pointerEvents: "none",
                }}
                {...rest}
            />
        </Stack>
    );
}
