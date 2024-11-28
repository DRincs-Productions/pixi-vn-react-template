import { Box, DialogContent, DialogTitle, Divider, Drawer, FormControl, ModalClose, RadioGroup, Sheet, Typography } from "@mui/joy";
import { Theme, useMediaQuery } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { openSettingsState } from '../atoms/openSettingsState';
import ReturnMainMenuButton from '../components/ReturnMainMenuButton';
import AutoSettingToggle from './settings/AutoSettingToggle';
import DialoguesSettings from './settings/DialoguesSettings';
import FullScreenSettings from './settings/FullScreenSettings';
import HideInterfaceSettingToggle from './settings/HideInterfaceSettingToggle';
import OpenHistorySettingButton from './settings/OpenHistorySettingButton';
import SaveLoadSettingButtons from './settings/SaveLoadSettingButtons';
import SkipSettingToggle from './settings/SkipSettingToggle';
import ThemeSettings from './settings/ThemeSettings';

export default function Settings() {
    const [open, setOpen] = useRecoilState(openSettingsState);
    const { t } = useTranslation(["ui"]);
    const smScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const onkeydown = useCallback((event: KeyboardEvent) => {
        if (event.code == 'Escape') {
            setOpen((prev) => !prev)
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', onkeydown);
        return () => {
            window.removeEventListener('keydown', onkeydown);
        };
    }, [onkeydown]);

    return (
        <Drawer
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
                                <SkipSettingToggle />
                                <AutoSettingToggle />
                                <OpenHistorySettingButton />
                                <SaveLoadSettingButtons />
                                <HideInterfaceSettingToggle />
                            </Box>
                        </RadioGroup>
                    </FormControl>
                    <Typography level="title-md" fontWeight="bold">
                        {t("dialogues")}
                    </Typography>
                    <DialoguesSettings />

                    <Typography level="title-md" fontWeight="bold">
                        {t("display")}
                    </Typography>
                    <FullScreenSettings />
                    <ThemeSettings />
                </DialogContent>
                <Divider sx={{ mt: 'auto' }} />
                <ReturnMainMenuButton />
            </Sheet>
        </Drawer>
    );
}
