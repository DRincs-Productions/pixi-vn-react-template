import { sound } from "@drincs/pixi-vn";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Box, FormHelperText, FormLabel, IconButton, Slider, Stack } from "@mui/joy";
import { useStore } from "@tanstack/react-store";
import { useTranslation } from "react-i18next";
import SoundChannelControl from "../../components/SoundChannelControl";
import { masterSoundStore, setMasterVolume, toggleMasterMuted } from "../../stores/useMasterSoundStore";

export default function SoundSettings() {
    const { t } = useTranslation(["ui"]);

    const masterVolume = useStore(masterSoundStore, (s) => s.volume);
    const masterMuted = useStore(masterSoundStore, (s) => s.muted);

    return (
        <Stack spacing={1} sx={{ p: 1 }}>
            <Box>
                <FormLabel sx={{ typography: "title-sm" }}>{t("master_volume") || "Master"}</FormLabel>
                <FormHelperText sx={{ typography: "body-sm" }}>{t("master_volume_description")}</FormHelperText>
            </Box>
            <Stack direction="row" alignItems="center" spacing={1}>
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
                <Box component="span" sx={{ minWidth: 36, textAlign: "right" }}>
                    {masterVolume}%
                </Box>
            </Stack>

            {sound.channels.map((c) => (
                <SoundChannelControl
                    key={c.alias}
                    label={t(`${c.alias}_volume`)}
                    helper={t(`${c.alias}_volume_description`)}
                    alias={c.alias}
                    disabled={masterMuted}
                />
            ))}
        </Stack>
    );
}
