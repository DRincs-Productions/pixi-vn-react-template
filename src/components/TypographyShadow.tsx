import { Typography, type TypographyProps, useTheme } from "@mui/joy";

export default function TypographyShadow({ sx, shadowColor, ...rest }: TypographyProps & { shadowColor?: string }) {
    const theme = useTheme();
    const defaultShadowColor = shadowColor ?? theme.palette.neutral[900];

    return (
        <Typography
            sx={{
                textShadow: `0 0 3px ${defaultShadowColor}, 0 0 5px ${defaultShadowColor}`,
                pointerEvents: "auto",
                color: theme.palette.neutral[300],
                ...sx,
            }}
            {...rest}
        />
    );
}
