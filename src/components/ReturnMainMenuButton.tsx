import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Button, Stack, Typography } from "@mui/joy";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { openSettingsState } from '../atoms/openSettingsState';
import ModalDialogCustom from '../components/ModalDialog';
import { gameEnd } from '../utils/actions-utility';
import { useMyNavigate } from '../utils/navigate-utility';

export default function ReturnMainMenuButton() {
    const openSettings = useSetRecoilState(openSettingsState);
    const navigate = useMyNavigate();
    const [openDialog, setOpenDialog] = useState(false)
    const { t } = useTranslation(["ui"]);

    const location = useLocation();
    if (location.pathname === '/') {
        return null
    }

    return (
        <>
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
                    onClick={() => setOpenDialog(true)}
                >
                    {t("return_main_menu")}
                </Button>
            </Stack>
            <ModalDialogCustom
                open={openDialog}
                setOpen={setOpenDialog}
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
                            openSettings(false)
                            setOpenDialog(false)
                        }}
                        startDecorator={<ExitToAppIcon />}
                    >
                        {t("exit")}
                    </Button>
                    <Button
                        key={'cancel'}
                        color="neutral"
                        variant="plain"
                        onClick={() => setOpenDialog(false)}
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
