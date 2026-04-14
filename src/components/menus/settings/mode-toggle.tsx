import AutoModeIcon from "@mui/icons-material/AutoMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Box, FormHelperText, FormLabel, IconButton, ToggleButtonGroup, Tooltip } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/providers/theme-provider";

export default function ModeToggle() {
    const { setTheme, theme } = useTheme();
    const { t } = useTranslation(["ui"]);

    return (
        <>
            <Box>
                <FormLabel sx={{ typography: "title-sm" }}>{t("theme_mode")}</FormLabel>
                <FormHelperText sx={{ typography: "body-sm" }}>
                    {t("theme_mode_description")}
                </FormHelperText>
            </Box>
            <ToggleButtonGroup
                value={theme}
                onChange={(_, newValue) => {
                    setTheme(newValue as "light" | "dark" | "system");
                }}
            >
                <Tooltip title="Light Mode">
                    <span>
                        <IconButton value="light">
                            <LightModeIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="System Mode">
                    <span>
                        <IconButton value="system">
                            <AutoModeIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Dark Mode">
                    <span>
                        <IconButton value="dark">
                            <DarkModeIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </ToggleButtonGroup>
        </>
    );
}
