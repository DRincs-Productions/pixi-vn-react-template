import FastForwardIcon from "@mui/icons-material/FastForward";
import HdrAutoIcon from "@mui/icons-material/HdrAuto";
import { Box, FormHelperText, FormLabel, Slider, Typography } from "@mui/joy";
import { useLocation } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useTranslation } from "react-i18next";
import SettingButton from "@/components/SettingButton";
import { AutoSettings } from "@/lib/stores/auto-settings-store";
import { SkipSettings } from "@/lib/stores/skip-settings-store";
import { TypewriterSettings } from "@/lib/stores/typewriter-settings-store";

export function DialoguesControls() {
    const typewriterDelay = useStore(TypewriterSettings.store, (state) => state.delay);
    const { t } = useTranslation(["ui"]);
    const autoEnabled = useStore(AutoSettings.store, (state) => state.enabled);
    const autoTime = useStore(AutoSettings.store, (state) => state.time);

    return (
        <>
            <Box>
                <FormLabel sx={{ typography: "title-sm" }}>{t("text_speed")}</FormLabel>
                <FormHelperText sx={{ typography: "body-sm" }}>
                    {t("text_speed_description")}
                </FormHelperText>
            </Box>
            <Box
                sx={{
                    paddingX: 3,
                }}
            >
                <Slider
                    defaultValue={typewriterDelay}
                    getAriaValueText={(value) => `${value}ms`}
                    step={10}
                    marks={[
                        {
                            value: 0,
                            label: t("off"),
                        },
                        {
                            value: 200,
                            label: "200ms",
                        },
                    ]}
                    valueLabelDisplay="on"
                    max={200}
                    min={0}
                    valueLabelFormat={(index) => {
                        if (index === 0) return t("off");
                        return `${index}ms`;
                    }}
                    onChange={(_, value) => {
                        TypewriterSettings.setDelay((value as number) || 0);
                    }}
                />
            </Box>
            <Box>
                <FormLabel sx={{ typography: "title-sm" }}>{t("auto_forward_time")}</FormLabel>
                <FormHelperText sx={{ typography: "body-sm" }}>
                    {t("auto_forward_time_description", {
                        autoName: t("auto_forward_time_restricted"),
                        textSpeedName: t("text_speed"),
                    })}
                </FormHelperText>
            </Box>
            <Box
                sx={{
                    paddingX: 3,
                }}
            >
                <Slider
                    defaultValue={autoTime}
                    getAriaValueText={(value) => `${value}s`}
                    step={1}
                    marks={[
                        {
                            value: 1,
                            label: "1s",
                        },
                        {
                            value: 10,
                            label: "10s",
                        },
                    ]}
                    valueLabelDisplay="on"
                    max={10}
                    min={1}
                    disabled={!autoEnabled}
                    valueLabelFormat={(index) => `${index}s`}
                    onChange={(_, value) => AutoSettings.setTime(value as number)}
                />
            </Box>
            <AutoSettingToggle />
            <SkipSettingToggle />
        </>
    );
}

export function AutoSettingToggle() {
    const { t } = useTranslation(["ui"]);
    const autoEnabled = useStore(AutoSettings.store, (state) => state.enabled);

    const location = useLocation();
    if (location.pathname === "/") {
        return null;
    }

    return (
        <SettingButton checked={autoEnabled} onClick={AutoSettings.toggleEnabled}>
            <HdrAutoIcon />
            <Typography level="title-md">{t("auto_forward_time_restricted")}</Typography>
        </SettingButton>
    );
}

export function SkipSettingToggle() {
    const { t } = useTranslation(["ui"]);
    const enabled = useStore(SkipSettings.store, (state) => state.enabled);

    const location = useLocation();
    if (location.pathname === "/") {
        return null;
    }

    return (
        <SettingButton checked={enabled} onClick={SkipSettings.toggleEnabled}>
            <FastForwardIcon />
            <Typography level="title-md">{t("skip")}</Typography>
            <Typography
                sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                }}
                level="body-md"
            >
                Press Space
            </Typography>
        </SettingButton>
    );
}
