import { Typography, TypographyProps, useTheme } from "@mui/joy";

export default function TypographyShadow({
    sx,
    shadowColor = useTheme().palette.neutral[900],
    ...rest
}: TypographyProps & { shadowColor?: string }) {
    return (
        <Typography
            sx={{
                textShadow: `0 0 3px ${shadowColor}, 0 0 5px ${shadowColor}`,
                pointerEvents: "auto",
                color: useTheme().palette.neutral[300],
                ...sx,
            }}
            {...rest}
        />
    );
}
