import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Box, FormHelperText, FormLabel, IconButton, Slider, Stack } from "@mui/joy";
import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { ChannelSoundStore } from "../stores/createChannelSoundStore";

type Props = {
    label: string;
    alias: string;
    disabled?: boolean;
    helper?: string;
};

export default function SoundChannelControl({ label, alias, disabled, helper }: Props) {
    const store = useMemo(() => ChannelSoundStore.getStore(alias), [alias]);
    const volume = useStore(store, (s) => s.volume);
    const muted = useStore(store, (s) => s.muted);

    return (
        <>
            <Box>
                <FormLabel sx={{ typography: "title-sm" }}>{label}</FormLabel>
                {helper ? <FormHelperText sx={{ typography: "body-sm" }}>{helper}</FormHelperText> : null}
            </Box>
            <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton disabled={disabled} onClick={() => ChannelSoundStore.toggleMuted(alias)}>
                    {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>
                <Slider
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(_, v) => ChannelSoundStore.setVolume(alias, Array.isArray(v) ? v[0] : (v as number))}
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
