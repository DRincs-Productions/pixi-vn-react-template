import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Button, Typography } from '@mui/joy';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { openLoadAlertState } from '../../atoms/openLoadAlertState';
import { quickSaveState } from '../../atoms/quickSaveState';
import { reloadInterfaceDataEventAtom } from '../../atoms/reloadInterfaceDataEventAtom';
import ModalDialogCustom from '../../components/ModalDialog';
import { useMyNavigate } from '../../utilities/navigate-utility';
import { loadSave, setQuickSave } from '../../utilities/save-utility';

export default function QuickLoadAlert() {
    const navigate = useMyNavigate();
    const notifyLoadEvent = useSetRecoilState(reloadInterfaceDataEventAtom);
    const [open, setOpen] = useRecoilState(openLoadAlertState);
    const { t } = useTranslation(["interface"]);
    const [quickSave, setQuickSaveAtom] = useRecoilState(quickSaveState)
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        window.addEventListener('keydown', onkeydown);
        return () => {
            window.removeEventListener('keydown', onkeydown);
        };
    }, []);

    function onkeydown(event: KeyboardEvent) {
        if (event.code == 'KeyS' && event.shiftKey) {
            setQuickSave()
                .then((save) => {
                    setQuickSaveAtom(save)
                    enqueueSnackbar(t("success_save"), { variant: 'success' })
                })
                .catch(() => {
                    enqueueSnackbar(t("fail_save"), { variant: 'error' })
                })
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
                        quickSave && loadSave(quickSave, navigate).then(() => {
                            notifyLoadEvent((prev) => prev + 1)
                            enqueueSnackbar(t("success_load"), { variant: 'success' })
                            setQuickSaveAtom(quickSave)
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