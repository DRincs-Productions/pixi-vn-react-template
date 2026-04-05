import { Link, type LinkProps, type LinkTypeMap, Typography, useTheme } from "@mui/joy";

interface TextMenuButtonProps
    extends LinkProps<
        LinkTypeMap["defaultComponent"],
        {
            component?: React.ElementType;
            focusVisible?: boolean;
        }
    > {
    to?: string;
    selected?: boolean;
}

export default function TextMenuButton(props: TextMenuButtonProps) {
    const { sx, children, disabled, selected, ...rest } = props;
    const theme = useTheme();

    return (
        <Link
            sx={{
                fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem", lg: "1rem", xl: "1.1rem" },
                userSelect: "none",
                ...sx,
            }}
            disabled={disabled}
            {...rest}
        >
            <Typography
                textColor={
                    selected
                        ? theme.palette.primary[500]
                        : disabled
                          ? theme.palette.neutral[500]
                          : theme.palette.neutral[300]
                }
                sx={{
                    fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem", lg: "1rem", xl: "1.1rem" },
                    userSelect: "none",
                    textShadow: `0 0 3px ${theme.palette.common.black}, 0 0 5px ${theme.palette.common.black}`,
                }}
            >
                {children}
            </Typography>
        </Link>
    );
}
