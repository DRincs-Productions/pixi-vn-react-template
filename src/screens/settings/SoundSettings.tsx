import { sound } from "@drincs/pixi-vn";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Box, Button, FormHelperText, FormLabel, IconButton, Slider, Stack } from "@mui/joy";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BGM_CHANNEL_NAME, SFX_CHANNEL_NAME } from "../../constans";
import useDebouncedEffect from "../../hooks/useDebouncedEffect";

function safeSetChannelVolume(channel: string, volume: number) {
    try {
        // prefer normalized 0..1 where possible
        const v = Math.max(0, Math.min(1, volume));
        sound.findChannel(channel).volume = v;
    } catch (e) {
        console.error("set channel volume error", e);
    }
}

function safeSetMasterVolume(volume: number) {
    try {
        const v = Math.max(0, Math.min(1, volume));
        sound.volumeAll = v;
    } catch (e) {
        console.error("set master volume error", e);
    }
}

export default function SoundSettings() {
    const { t } = useTranslation(["ui"]);

    // values in percent (0..100)
    const [master, setMaster] = useState<number>(100);
    const [bgm, setBgm] = useState<number>(100);
    const [sfx, setSfx] = useState<number>(100);

    const [mutedMaster, setMutedMaster] = useState(false);
    const [mutedBgm, setMutedBgm] = useState(false);
    const [mutedSfx, setMutedSfx] = useState(false);

    // previously stored volumes removed: now use mute API when available

    // initialize from sound API if available
    useEffect(() => {
        try {
            const vm = sound.volumeAll;
            setMaster(Math.round((vm ?? 1) * 100));
            const cb = sound.findChannel(BGM_CHANNEL_NAME);
            const cs = sound.findChannel(SFX_CHANNEL_NAME);
            if (cb) {
                const vv = cb.volume;
                setBgm(Math.round(vv * 100));
                if ("muted" in cb) setMutedBgm(Boolean(cb.muted));
            }
            if (cs) {
                const vv = cs.volume;
                setSfx(Math.round(vv * 100));
                if ("muted" in cs) setMutedSfx(Boolean(cs.muted));
            }
        } catch (e) {
            // ignore initialization errors
        }
    }, []);

    // Debounced effects to update sound system (convert percent -> 0..1)
    useDebouncedEffect(() => safeSetMasterVolume(master / 100), { delay: 80 }, [master]);
    useDebouncedEffect(() => safeSetChannelVolume(BGM_CHANNEL_NAME, bgm / 100), { delay: 80 }, [bgm]);
    useDebouncedEffect(() => safeSetChannelVolume(SFX_CHANNEL_NAME, sfx / 100), { delay: 80 }, [sfx]);

    function toggleMute(setMuted: (v: boolean) => void, muted: boolean, valueKey: "master" | "bgm" | "sfx") {
        try {
            if (valueKey === "master") {
                setMuted(sound.toggleMuteAll());
                return;
            }

            const channelName = valueKey === "bgm" ? BGM_CHANNEL_NAME : SFX_CHANNEL_NAME;
            const ch = sound.findChannel(channelName);
            if ("muted" in ch) {
                setMuted(sound.toggleMuteAll());
            }
        } catch (e) {
            console.error("toggle mute error", e);
        }
    }

    return (
        <>
            <Box>
                <FormLabel sx={{ typography: "title-sm" }}>{t("sound_settings") || "Sound"}</FormLabel>
                <FormHelperText sx={{ typography: "body-sm" }}>
                    {t("sound_settings_description") || "Controlla volume e mute"}
                </FormHelperText>
            </Box>

            <Stack spacing={1} sx={{ p: 1 }}>
                <Box>
                    <FormLabel sx={{ typography: "title-sm" }}>{t("master_volume") || "Master"}</FormLabel>
                </Box>
                <Stack direction='row' alignItems='center' spacing={1}>
                    <IconButton onClick={() => toggleMute(setMutedMaster, mutedMaster, "master")}>
                        {mutedMaster ? <VolumeOffIcon /> : <VolumeUpIcon />}
                    </IconButton>
                    <Slider
                        min={0}
                        max={100}
                        value={master}
                        onChange={(_, v) => setMaster(Array.isArray(v) ? v[0] : (v as number))}
                        sx={{ flex: 1 }}
                    />
                    <Box component='span' sx={{ minWidth: 36, textAlign: "right" }}>
                        {master}%
                    </Box>
                </Stack>

                <Box>
                    <FormLabel sx={{ typography: "title-sm" }}>{t("bgm_volume") || "BGM"}</FormLabel>
                </Box>
                <Stack direction='row' alignItems='center' spacing={1}>
                    <IconButton onClick={() => toggleMute(setMutedBgm, mutedBgm, "bgm")}>
                        {mutedBgm ? <VolumeOffIcon /> : <MusicNoteIcon />}
                    </IconButton>
                    <Slider
                        min={0}
                        max={100}
                        value={bgm}
                        onChange={(_, v) => setBgm(Array.isArray(v) ? v[0] : (v as number))}
                        sx={{ flex: 1 }}
                    />
                    <Box component='span' sx={{ minWidth: 36, textAlign: "right" }}>
                        {bgm}%
                    </Box>
                </Stack>

                <Box>
                    <FormLabel sx={{ typography: "title-sm" }}>{t("sfx_volume") || "SFX"}</FormLabel>
                </Box>
                <Stack direction='row' alignItems='center' spacing={1}>
                    <IconButton onClick={() => toggleMute(setMutedSfx, mutedSfx, "sfx")}>
                        {mutedSfx ? <VolumeOffIcon /> : <VolumeUpIcon />}
                    </IconButton>
                    <Slider
                        min={0}
                        max={100}
                        value={sfx}
                        onChange={(_, v) => setSfx(Array.isArray(v) ? v[0] : (v as number))}
                        sx={{ flex: 1 }}
                    />
                    <Box component='span' sx={{ minWidth: 36, textAlign: "right" }}>
                        {sfx}%
                    </Box>
                </Stack>

                <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
                    <Button
                        onClick={() => {
                            // quick reset: restore to 100
                            setMaster(100);
                            setBgm(100);
                            setSfx(100);
                            setMutedMaster(false);
                            setMutedBgm(false);
                            setMutedSfx(false);
                        }}
                    >
                        {t("reset") || "Reset"}
                    </Button>
                </Box>
            </Stack>
        </>
    );
}
