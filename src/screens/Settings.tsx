import AutoModeIcon from '@mui/icons-material/AutoMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DownloadIcon from '@mui/icons-material/Download';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import HdrAutoIcon from '@mui/icons-material/HdrAuto';
import HistoryIcon from '@mui/icons-material/History';
import LightModeIcon from '@mui/icons-material/LightMode';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import WbIncandescentIcon from '@mui/icons-material/WbIncandescent';
import { Box, Button, DialogContent, DialogTitle, Divider, Drawer, FormControl, FormHelperText, FormLabel, IconButton, ModalClose, RadioGroup, Sheet, Slider, Stack, ToggleButtonGroup, Tooltip, Typography, useColorScheme } from "@mui/joy";
import { Theme, useColorScheme as useColorSchemeMaterial, useMediaQuery } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Hue, useColor } from "react-color-palette";
import "react-color-palette/css";
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { autoInfoState } from '../atoms/autoInfoState';
import { hideInterfaceState } from '../atoms/hideInterfaceState';
import { openGameSaveScreenState } from '../atoms/openGameSaveScreenState';
import { openHistoryScreenState } from '../atoms/openHistoryScreenState';
import { openSettingsState } from '../atoms/openSettingsState';
import { saveLoadAlertState } from '../atoms/saveLoadAlertState';
import { skipEnabledState } from '../atoms/skipEnabledState';
import { typewriterDelayState } from '../atoms/typewriterDelayState';
import ModalDialogCustom from '../components/ModalDialog';
import SettingButton from '../components/SettingButton';
import { useEditColorProvider } from '../providers/ThemeProvider';
import { INTERFACE_DATA_USE_QUEY_KEY } from '../use_query/useQueryInterface';
import useQueryLastSave, { LAST_SAVE_USE_QUEY_KEY } from '../use_query/useQueryLastSave';
import { SAVES_USE_QUEY_KEY } from '../use_query/useQuerySaves';
import { gameEnd } from '../utilities/actions-utility';
import { useMyNavigate } from '../utilities/navigate-utility';
import { downloadGameSave, loadGameSaveFromFile, putSaveIntoIndexDB } from '../utilities/save-utility';

export default function Settings() {
    const [open, setOpen] = useRecoilState(openSettingsState);
    const { mode, setMode } = useColorScheme();
    const { setMode: setModeMaterial } = useColorSchemeMaterial();
    const { primaryColor, setPrimaryColor, setSolidColor, solidColor } = useEditColorProvider()
    const [tempColor, setTempColor] = useColor(primaryColor);
    const navigate = useMyNavigate();
    const location = useLocation();
    const [openYouSure, setOpenYouSure] = useState(false)
    const [typewriterDelay, setTypewriterDelay] = useRecoilState(typewriterDelayState)
    const [fullScreenEnabled, setFullScreenEnabled] = useState(false)
    const { t } = useTranslation(["ui"]);
    const [skip, setSkip] = useRecoilState(skipEnabledState)
    const [auto, setAuto] = useRecoilState(autoInfoState)
    const setOpenHistory = useSetRecoilState(openHistoryScreenState);
    const setOpenLoadAlert = useSetRecoilState(saveLoadAlertState);
    const [hideInterface, setHideInterface] = useRecoilState(hideInterfaceState);
    const openSaveScreen = useSetRecoilState(openGameSaveScreenState);
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar();
    const {
        data: lastSave = null,
    } = useQueryLastSave()
    const smScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    useEffect(() => {
        window.addEventListener('keydown', onkeydown);
        return () => {
            window.removeEventListener('keydown', onkeydown);
        };
    }, []);

    useEffect(() => {
        // Debouncing
        let timeout = setTimeout(() => {
            setPrimaryColor(tempColor.hex)
        }, 50);

        return () => {
            clearTimeout(timeout)
        }
    }, [tempColor]);

    function onkeydown(event: KeyboardEvent) {
        if (event.code == 'Escape') {
            setOpen((prev) => !prev)
        }
    }

    return (
        <>
            <Drawer
                // size={'lg'}
                variant="plain"
                open={open}
                onClose={() => setOpen(false)}
                sx={{
                    '& .MuiDrawer-content': {
                        width: smScreen ? '100%' : 600,
                        maxWidth: '100%',
                    },
                }}
                slotProps={{
                    content: {
                        sx: {
                            bgcolor: 'transparent',
                            p: { md: 3, sm: 0 },
                            boxShadow: 'none',
                        },
                    },
                }}
            >
                <Sheet
                    sx={{
                        borderRadius: 'md',
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        height: '100%',
                        overflow: 'auto',
                    }}
                >
                    <DialogTitle>{t("settings")}</DialogTitle>
                    <ModalClose />
                    <Divider sx={{ mt: 'auto' }} />
                    <DialogContent sx={{ gap: 2 }}>
                        <FormControl>
                            <RadioGroup>
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                        gap: 1.5,
                                    }}
                                >
                                    <SettingButton
                                        checked={skip}
                                        onClick={() => setSkip((prev) => !prev)}
                                    >
                                        <FastForwardIcon />
                                        <Typography level="title-md">{t("skip")}</Typography>
                                        <Typography
                                            sx={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                            }}
                                            level="body-md"
                                        >
                                            Press Space
                                        </Typography>
                                    </SettingButton>
                                    <SettingButton
                                        checked={auto.enabled}
                                        onClick={() => setAuto((prev) => ({
                                            ...prev,
                                            enabled: !prev.enabled
                                        }))}
                                    >
                                        <HdrAutoIcon />
                                        <Typography level="title-md">{t("auto_forward_time_restricted")}</Typography>
                                    </SettingButton>
                                    <SettingButton
                                        onClick={() => {
                                            setOpenHistory(true)
                                            setOpen(false)
                                        }}
                                    >
                                        <HistoryIcon />
                                        <Typography level="title-md">{t("history")}</Typography>
                                        <Typography
                                            sx={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                            }}
                                            level="body-md"
                                        >
                                            Shift+H
                                        </Typography>
                                    </SettingButton>
                                    <SettingButton
                                        onClick={() => {
                                            putSaveIntoIndexDB()
                                                .then((save) => {
                                                    queryClient.setQueryData([SAVES_USE_QUEY_KEY, save.id], save);
                                                    queryClient.setQueryData([LAST_SAVE_USE_QUEY_KEY], save);
                                                    enqueueSnackbar(t("success_save"), { variant: 'success' })
                                                })
                                                .catch(() => {
                                                    enqueueSnackbar(t("fail_save"), { variant: 'error' })
                                                })
                                        }}
                                    >
                                        <SaveAsIcon />
                                        <Typography level="title-md">{t("quick_save")}</Typography>
                                        <Typography
                                            sx={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                            }}
                                            level="body-md"
                                        >
                                            Shift+S
                                        </Typography>
                                    </SettingButton>
                                    <SettingButton
                                        onClick={() => {
                                            lastSave && setOpenLoadAlert({ open: true, data: lastSave, type: 'load' })
                                            setOpen(false)
                                        }}
                                        disabled={!lastSave}
                                    >
                                        <FileUploadIcon />
                                        <Typography level="title-md">{t("load_last_save")}</Typography>
                                        <Typography
                                            sx={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                            }}
                                            level="body-md"
                                        >
                                            Shift+L
                                        </Typography>
                                    </SettingButton>
                                    <SettingButton
                                        onClick={() => {
                                            openSaveScreen(true)
                                            setOpen(false)
                                        }}
                                    >
                                        <SaveIcon />
                                        <Typography level="title-md">{t(`${t("save")}/${t("load")}`)}</Typography>
                                    </SettingButton>
                                    <SettingButton
                                        onClick={() => downloadGameSave()}
                                    >
                                        <DownloadIcon />
                                        <Typography level="title-md">{t("save_to_file")}</Typography>
                                    </SettingButton>
                                    <SettingButton
                                        onClick={() => loadGameSaveFromFile(navigate, () => {
                                            queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] })
                                            enqueueSnackbar(t("success_load"), { variant: 'success' })
                                            setOpen(false)
                                        })}
                                    >
                                        <FolderOpenIcon />
                                        <Typography level="title-md">{t("load_from_file")}</Typography>
                                    </SettingButton>
                                    <SettingButton
                                        checked={hideInterface}
                                        onClick={() => setHideInterface((prev) => !prev)}
                                    >
                                        <VisibilityOffIcon />
                                        <Typography level="title-md">{t("hide_ui")}</Typography>
                                        <Typography
                                            sx={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                            }}
                                            level="body-md"
                                        >
                                            Shift+V
                                        </Typography>
                                    </SettingButton>
                                </Box>
                            </RadioGroup>
                        </FormControl>
                        <Typography level="title-md" fontWeight="bold">
                            {t("dialogues")}
                        </Typography>
                        <Box>
                            <FormLabel sx={{ typography: 'title-sm' }}>
                                {t("text_speed")}
                            </FormLabel>
                            <FormHelperText sx={{ typography: 'body-sm' }}>
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
                                        label: t('off'),
                                    },
                                    {
                                        value: 200,
                                        label: '200ms',
                                    },
                                ]}
                                valueLabelDisplay="on"
                                max={200}
                                min={0}
                                valueLabelFormat={(index) => {
                                    if (index === 0) return t('off')
                                    return `${index}ms`
                                }}

                                onChange={(_, value) => {
                                    setTypewriterDelay(value as number || 0)
                                }}
                            />
                        </Box>
                        <Box>
                            <FormLabel sx={{ typography: 'title-sm' }}>
                                {t("auto_forward_time")}
                            </FormLabel>
                            <FormHelperText sx={{ typography: 'body-sm' }}>
                                {t("auto_forward_time_description", { autoName: t("auto_forward_time_restricted"), textSpeedName: t("text_speed") })}
                            </FormHelperText>
                        </Box>
                        <Box
                            sx={{
                                paddingX: 3,
                            }}
                        >
                            <Slider
                                defaultValue={auto.time}
                                getAriaValueText={(value) => `${value}s`}
                                step={1}
                                marks={[
                                    {
                                        value: 1,
                                        label: '1s',
                                    },
                                    {
                                        value: 10,
                                        label: '10s',
                                    },
                                ]}
                                valueLabelDisplay="on"
                                max={10}
                                min={1}
                                disabled={!auto}
                                valueLabelFormat={(index) => index + "s"}
                                onChange={(_, value) => {
                                    if (value)
                                        setAuto((prev) => ({
                                            ...prev,
                                            time: value as number
                                        }))
                                }}
                            />
                        </Box>

                        <Typography level="title-md" fontWeight="bold">
                            {t("display")}
                        </Typography>
                        <Box>
                            <FormLabel sx={{ typography: 'title-sm' }}>
                                {t("fullscreen")}
                            </FormLabel>
                            <FormHelperText sx={{ typography: 'body-sm' }}>
                                {t("fullscreen_description")}
                            </FormHelperText>
                        </Box>
                        <Button
                            onClick={() => {
                                if (fullScreenEnabled) {
                                    document.exitFullscreen()
                                    setFullScreenEnabled(false)
                                } else {
                                    document.documentElement.requestFullscreen()
                                    setFullScreenEnabled(true)
                                }
                            }}
                            startDecorator={fullScreenEnabled ? <FullscreenExitIcon /> : <FullscreenIcon />}
                        >
                            {fullScreenEnabled ? t('exit_fullscreen') : t('enter_fullscreen')}
                        </Button>

                        <Box>
                            <FormLabel sx={{ typography: 'title-sm' }}>
                                {t("theme_mode")}
                            </FormLabel>
                            <FormHelperText sx={{ typography: 'body-sm' }}>
                                {t("theme_mode_description")}
                            </FormHelperText>
                        </Box>
                        <ToggleButtonGroup
                            value={mode}
                            onChange={(_, newValue) => {
                                if (newValue) {
                                    setMode(newValue)
                                    setModeMaterial(newValue)
                                }
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

                        <Box>
                            <FormLabel sx={{ typography: 'title-sm' }}>
                                {t("primary_color")}
                            </FormLabel>
                            <FormHelperText sx={{ typography: 'body-sm' }}>
                                {t("primary_color_description")}
                            </FormHelperText>
                        </Box>
                        <Box
                            sx={{
                                paddingX: 3,
                            }}
                        >
                            <Hue
                                color={tempColor}
                                onChange={(color) => setTempColor(color)}
                            />
                        </Box>

                        <Box>
                            <FormLabel sx={{ typography: 'title-sm' }}>
                                {t("solid_color")}
                            </FormLabel>
                            <FormHelperText sx={{ typography: 'body-sm' }}>
                                {t("solid_color_description")}
                            </FormHelperText>
                        </Box>
                        <ToggleButtonGroup
                            value={solidColor}
                            onChange={(_, newValue) => {
                                if (newValue)
                                    setSolidColor(newValue)
                            }}
                        >
                            <Tooltip title="White">
                                <span>
                                    <IconButton value="white">
                                        <WbIncandescentIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <Tooltip title="Black">
                                <span>
                                    <IconButton value="black">
                                        <ModeNightIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </ToggleButtonGroup>
                        <ToggleButtonGroup
                            color="primary"
                            variant="solid"
                        >
                            <Button>{t("example")}</Button>
                        </ToggleButtonGroup>
                    </DialogContent>
                    {location.pathname !== '/' && <>
                        <Divider sx={{ mt: 'auto' }} />
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            useFlexGap
                            spacing={1}
                        >
                            <Button
                                variant="outlined"
                                color="danger"
                                startDecorator={<ExitToAppIcon />}
                                onClick={() => setOpenYouSure(true)}
                            >
                                {t("return_main_menu")}
                            </Button>
                        </Stack>
                    </>}
                </Sheet>
            </Drawer>

            <ModalDialogCustom
                open={openYouSure}
                setOpen={setOpenYouSure}
                color='danger'
                head={<Typography level="h4"
                    startDecorator={<ExitToAppIcon />}
                >
                    {t("attention")}
                </Typography>}
                actions={<>
                    <Button
                        key={'exit'}
                        color='danger'
                        variant="outlined"
                        onClick={() => {
                            gameEnd(navigate)
                            setOpen(false)
                            setOpenYouSure(false)
                        }}
                        startDecorator={<ExitToAppIcon />}
                    >
                        {t("exit")}
                    </Button>
                    <Button
                        key={'cancel'}
                        color="neutral"
                        variant="plain"
                        onClick={() => setOpenYouSure(false)}
                    >
                        {t("cancel")}
                    </Button>
                </>}
            >
                <Typography>
                    {t("you_sure_to_return_main_menu")}
                </Typography>
            </ModalDialogCustom>
        </>
    );
}
