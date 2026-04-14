import { sound } from "@drincs/pixi-vn";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Box, FormHelperText, FormLabel, IconButton, Slider, Stack } from "@mui/joy";
import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChannelSound } from "@/lib/stores/channel-sound-stores";
import { MasterSound } from "@/lib/stores/master-sound-storage";

export function SoundSettings() {
    const { t } = useTranslation(["ui"]);

    const masterVolume = useStore(MasterSound.store, (s) => s.volume);
    const masterMuted = useStore(MasterSound.store, (s) => s.muted);

    return (
        <Stack spacing={1} sx={{ p: 1 }}>
            <Box>
                <FormLabel sx={{ typography: "title-sm" }}>
                    {t("master_volume") || "Master"}
                </FormLabel>
                <FormHelperText sx={{ typography: "body-sm" }}>
                    {t("master_volume_description")}
                </FormHelperText>
            </Box>
            <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton onClick={() => MasterSound.toggleMuted()}>
                    {masterMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>
                <Slider
                    min={0}
                    max={100}
                    value={masterVolume}
                    onChange={(_, v) =>
                        MasterSound.setVolume(Array.isArray(v) ? v[0] : (v as number))
                    }
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

export default function SoundChannelControl({
    label,
    alias,
    disabled,
    helper,
}: {
    label: string;
    alias: string;
    disabled?: boolean;
    helper?: string;
}) {
    const store = useMemo(() => ChannelSound.getStore(alias), [alias]);
    const volume = useStore(store, (s) => s.volume);
    const muted = useStore(store, (s) => s.muted);

    return (
        <>
            <Box>
                <FormLabel sx={{ typography: "title-sm" }}>{label}</FormLabel>
                {helper ? (
                    <FormHelperText sx={{ typography: "body-sm" }}>{helper}</FormHelperText>
                ) : null}
            </Box>
            <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton disabled={disabled} onClick={() => ChannelSound.toggleMuted(alias)}>
                    {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>
                <Slider
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(_, v) =>
                        ChannelSound.setVolume(alias, Array.isArray(v) ? v[0] : (v as number))
                    }
                    disabled={disabled}
                    sx={{ flex: 1 }}
                    step={1}
                />
                <Box component="span" sx={{ minWidth: 36, textAlign: "right" }}>
                    {volume}%
                </Box>
            </Stack>
        </>
    );
}
