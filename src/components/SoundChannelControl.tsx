import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Box, FormHelperText, FormLabel, IconButton, Slider, Stack } from "@mui/joy";
import { useEffect } from "react";
import createChannelSoundStore from "../stores/createChannelSoundStore";

type Props = {
    label: string;
    alias: string;
    disabled?: boolean;
    helper?: string;
};

export default function SoundChannelControl({ label, alias, disabled, helper }: Props) {
    const storeHook = createChannelSoundStore(alias);
    const volume = storeHook((s) => s.volume);
    const muted = storeHook((s) => s.muted);
    const setVolume = storeHook((s) => s.setVolume);
    const toggleMuted = storeHook((s) => s.toggleMuted);
    const setMuted = storeHook((s) => s.setMuted);

    useEffect(() => {
        const m = localStorage.getItem("master_muted");
        if (m !== null) {
            setMuted(m === "true");
        }
        let v = localStorage.getItem("master_volume");
        if (v !== null) {
            const vn = parseInt(v);
            if (!isNaN(vn)) setVolume(vn);
        }

        return () => {
            localStorage.setItem("master_muted", muted.toString());
            localStorage.setItem("master_volume", volume.toString());
        };
    }, []);

    return (
        <>
            <Box>
                <FormLabel sx={{ typography: "title-sm" }}>{label}</FormLabel>
                {helper ? <FormHelperText sx={{ typography: "body-sm" }}>{helper}</FormHelperText> : null}
            </Box>
            <Stack direction='row' alignItems='center' spacing={1}>
                <IconButton disabled={disabled} onClick={() => toggleMuted()}>
                    {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>
                <Slider
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(_, v) => setVolume(Array.isArray(v) ? v[0] : (v as number))}
                    disabled={disabled}
                    sx={{ flex: 1 }}
                    step={1}
                />
                <Box component='span' sx={{ minWidth: 36, textAlign: "right" }}>
                    {volume}%
                </Box>
            </Stack>
        </>
    );
}
