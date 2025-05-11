import AutoModeIcon from "@mui/icons-material/AutoMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import WbIncandescentIcon from "@mui/icons-material/WbIncandescent";
import {
    Box,
    Button,
    FormHelperText,
    FormLabel,
    IconButton,
    ToggleButtonGroup,
    Tooltip,
    useColorScheme,
} from "@mui/joy";
import { useColorScheme as useColorSchemeMaterial } from "@mui/material";
import { Hue, useColor } from "react-color-palette";
import "react-color-palette/css";
import { useTranslation } from "react-i18next";
import useDebouncedEffect from "../../hooks/useDebouncedEffect";
import { useEditColorProvider } from "../../providers/ThemeProvider";

export default function ThemeSettings() {
    const { mode, setMode } = useColorScheme();
    const { setMode: setModeMaterial } = useColorSchemeMaterial();
    const { primaryColor, setPrimaryColor, setSolidColor, solidColor } = useEditColorProvider();
    const [tempColor, setTempColor] = useColor(primaryColor);
    const { t } = useTranslation(["ui"]);

    useDebouncedEffect(() => setPrimaryColor(tempColor.hex), { delay: 50 }, [tempColor]);

    return (
        <>
            <Box>
                <FormLabel sx={{ typography: "title-sm" }}>{t("theme_mode")}</FormLabel>
                <FormHelperText sx={{ typography: "body-sm" }}>{t("theme_mode_description")}</FormHelperText>
            </Box>
            <ToggleButtonGroup
                value={mode}
                onChange={(_, newValue) => {
                    if (newValue) {
                        setMode(newValue);
                        setModeMaterial(newValue);
                    }
                }}
            >
                <Tooltip title='Light Mode'>
                    <span>
                        <IconButton value='light'>
                            <LightModeIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title='System Mode'>
                    <span>
                        <IconButton value='system'>
                            <AutoModeIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title='Dark Mode'>
                    <span>
                        <IconButton value='dark'>
                            <DarkModeIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </ToggleButtonGroup>

            <Box>
                <FormLabel sx={{ typography: "title-sm" }}>{t("primary_color")}</FormLabel>
                <FormHelperText sx={{ typography: "body-sm" }}>{t("primary_color_description")}</FormHelperText>
            </Box>
            <Box
                sx={{
                    paddingX: 3,
                }}
            >
                <Hue color={tempColor} onChange={(color) => setTempColor(color)} />
            </Box>

            <Box>
                <FormLabel sx={{ typography: "title-sm" }}>{t("solid_color")}</FormLabel>
                <FormHelperText sx={{ typography: "body-sm" }}>{t("solid_color_description")}</FormHelperText>
            </Box>
            <ToggleButtonGroup
                value={solidColor}
                onChange={(_, newValue) => {
                    if (newValue) setSolidColor(newValue);
                }}
            >
                <Tooltip title='White'>
                    <span>
                        <IconButton value='white'>
                            <WbIncandescentIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title='Black'>
                    <span>
                        <IconButton value='black'>
                            <ModeNightIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </ToggleButtonGroup>
            <ToggleButtonGroup color='primary' variant='solid'>
                <Button>{t("example")}</Button>
            </ToggleButtonGroup>
        </>
    );
}
