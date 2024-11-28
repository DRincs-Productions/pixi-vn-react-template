import HistoryIcon from '@mui/icons-material/History';
import { Typography } from "@mui/joy";
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { openHistoryScreenState } from '../../atoms/openHistoryScreenState';
import { openSettingsState } from '../../atoms/openSettingsState';
import SettingButton from '../../components/SettingButton';

export default function OpenHistorySettingButton() {
    const { t } = useTranslation(["ui"]);
    const setOpenHistory = useSetRecoilState(openHistoryScreenState);
    const openSettings = useSetRecoilState(openSettingsState);

    const location = useLocation();
    if (location.pathname === '/') {
        return null
    }

    return (
        <SettingButton
            onClick={() => {
                setOpenHistory(true)
                openSettings(false)
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
    );
}
