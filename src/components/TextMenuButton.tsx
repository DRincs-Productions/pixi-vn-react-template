import { Link, LinkProps, LinkTypeMap, Typography, useTheme } from "@mui/joy";

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
                        ? useTheme().palette.primary[500]
                        : disabled
                        ? useTheme().palette.neutral[500]
                        : useTheme().palette.neutral[300]
                }
                sx={{
                    fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem", lg: "1rem", xl: "1.1rem" },
                    userSelect: "none",
                    textShadow: `0 0 3px ${useTheme().palette.common.black}, 0 0 5px ${
                        useTheme().palette.common.black
                    }`,
                }}
            >
                {children}
            </Typography>
        </Link>
    );
}
