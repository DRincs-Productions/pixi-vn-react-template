import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Button, FormHelperText, FormLabel } from "@mui/joy";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function FullScreenSettings() {
    const [fullScreenEnabled, setFullScreenEnabled] = useState(false)
    const { t } = useTranslation(["ui"]);

    return (
        <>
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
        </>
    );
}
