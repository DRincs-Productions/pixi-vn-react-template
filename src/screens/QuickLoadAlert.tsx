import { getSaveJson } from '@drincs/pixi-vn';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Button, Typography } from '@mui/joy';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { openLoadAlertState } from '../atoms/openLoadAlertState';
import { quickSaveState } from '../atoms/quickSaveState';
import { reloadInterfaceDataEventState } from '../atoms/reloadInterfaceDataEventState';
import ModalDialogCustom from '../components/ModalDialog';
import { loadQuickSave } from '../utility/ActionsUtility';
import { useMyNavigate } from '../utility/useMyNavigate';

export default function QuickLoadAlert() {
    const navigate = useMyNavigate();
    const notifyLoadEvent = useSetRecoilState(reloadInterfaceDataEventState);
    const [open, setOpen] = useRecoilState(openLoadAlertState);
    const { t } = useTranslation(["translation"]);
    const [quickSave, setQuickSave] = useRecoilState(quickSaveState)
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        window.addEventListener('keydown', onkeydown);
        return () => {
            window.removeEventListener('keydown', onkeydown);
        };
    }, []);

    function onkeydown(event: KeyboardEvent) {
        if (event.code == 'KeyS' && event.shiftKey) {
            let save = getSaveJson()
            setQuickSave(save)
            enqueueSnackbar(t("success_save"), { variant: 'success' })
        }
        else if (event.code == 'KeyL' && event.shiftKey) {
            setOpen((prev) => !prev)
        }
    }

    return (
        <ModalDialogCustom
            open={open}
            setOpen={setOpen}
            color="primary"
            head={<Typography level="h4"
                startDecorator={<CloudDownloadIcon />}
            >
                {t("load")}
            </Typography>}
            actions={<>
                <Button
                    key={'exit'}
                    color='primary'
                    variant="outlined"
                    onClick={() => {
                        loadQuickSave(quickSave, navigate, () => {
                            notifyLoadEvent((prev) => prev + 1)
                            enqueueSnackbar(t("success_load"), { variant: 'success' })
                        })
                        setOpen(false)
                    }}
                    startDecorator={<CloudDownloadIcon />}
                >
                    {t("confirm")}
                </Button>
                <Button
                    key={'cancel'}
                    color="neutral"
                    variant="plain"
                    onClick={() => setOpen(false)}
                >
                    {t("cancel")}
                </Button>
            </>}
        >
            <Typography>
                {t("you_sure_to_quick_load")}
            </Typography>
        </ModalDialogCustom>
    );
}
