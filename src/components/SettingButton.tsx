import { Card, CardContent, type CardProps, Checkbox, useTheme } from "@mui/joy";

export default function SettingButton({
    children,
    checked,
    disabled,
    sx,
    onChange,
    onClick,
    ...rest
}: {
    checked?: boolean;
    disabled?: boolean;
} & CardProps) {
    const theme = useTheme();
    return (
        <Card
            sx={{
                boxShadow: "none",
                "&:hover": disabled ? undefined : { bgcolor: "background.level1" },
                backgroundColor: disabled ? theme.palette.neutral[100] : undefined,
                ...sx,
            }}
            onClick={disabled ? undefined : onClick}
            {...rest}
        >
            <CardContent>{children}</CardContent>
            <Checkbox
                disableIcon
                overlay
                checked={true}
                variant="outlined"
                color="neutral"
                onChange={onChange}
                sx={{ mt: -2 }}
                disabled={disabled}
                slotProps={{
                    action: {
                        sx: {
                            borderWidth: checked ? 2 : undefined,
                            borderColor: checked ? theme.palette.primary.outlinedBorder : undefined,
                            "&:hover": disabled
                                ? undefined
                                : {
                                      bgcolor: "transparent",
                                  },
                        },
                    },
                }}
            />
        </Card>
    );
}
