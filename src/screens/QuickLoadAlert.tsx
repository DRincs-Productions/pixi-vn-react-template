import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Button, Typography } from '@mui/joy';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { openLoadAlertState } from '../atoms/openLoadAlertState';
import { reloadInterfaceDataEventState } from '../atoms/reloadInterfaceDataEventState';
import ModalDialogCustom from '../components/ModalDialog';
import { loadQuickSave } from '../utility/ActionsUtility';
import { useMyNavigate } from '../utility/useMyNavigate';

export default function QuickLoadAlert() {
    const navigate = useMyNavigate();
    const notifyLoadEvent = useSetRecoilState(reloadInterfaceDataEventState);
    const [open, setOpen] = useRecoilState(openLoadAlertState);
    const { t } = useTranslation(["translation"]);
    const { enqueueSnackbar } = useSnackbar();

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
                        loadQuickSave(navigate, () => {
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
