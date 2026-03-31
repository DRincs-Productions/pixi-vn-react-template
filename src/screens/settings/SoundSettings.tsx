import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Box, FormHelperText, FormLabel, IconButton, Slider, Stack } from "@mui/joy";
import { useTranslation } from "react-i18next";
import SoundChannelControl from "../../components/SoundChannelControl";
import { BGM_CHANNEL_NAME, SFX_CHANNEL_NAME } from "../../constans";
import useMasterSoundStore from "../../stores/useMasterSoundStore";

export default function SoundSettings() {
    const { t } = useTranslation(["ui"]);

    const masterVolume = useMasterSoundStore((s) => s.volume);
    const setMasterVolume = useMasterSoundStore((s) => s.setVolume);
    const masterMuted = useMasterSoundStore((s) => s.muted);
    const toggleMasterMuted = useMasterSoundStore((s) => s.toggleMuted);

    return (
        <Stack spacing={1} sx={{ p: 1 }}>
            <Box>
                <FormLabel sx={{ typography: "title-sm" }}>{t("master_volume") || "Master"}</FormLabel>
                <FormHelperText sx={{ typography: "body-sm" }}>{t("master_volume_description")}</FormHelperText>
            </Box>
            <Stack direction='row' alignItems='center' spacing={1}>
                <IconButton onClick={() => toggleMasterMuted()}>
                    {masterMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>
                <Slider
                    min={0}
                    max={100}
                    value={masterVolume}
                    onChange={(_, v) => setMasterVolume(Array.isArray(v) ? v[0] : (v as number))}
                    sx={{ flex: 1 }}
                    step={1}
                />
                <Box component='span' sx={{ minWidth: 36, textAlign: "right" }}>
                    {masterVolume}%
                </Box>
            </Stack>

            <SoundChannelControl
                label={t("bgm_volume")}
                helper={t("bgm_volume_description")}
                alias={BGM_CHANNEL_NAME}
                disabled={masterMuted}
            />

            <SoundChannelControl
                label={t("sfx_volume")}
                helper={t("sfx_volume_description")}
                alias={SFX_CHANNEL_NAME}
                disabled={masterMuted}
            />
        </Stack>
    );
}
