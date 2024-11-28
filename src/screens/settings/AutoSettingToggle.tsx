import HdrAutoIcon from '@mui/icons-material/HdrAuto';
import { Typography } from "@mui/joy";
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { autoInfoState } from '../../atoms/autoInfoState';
import SettingButton from '../../components/SettingButton';

export default function AutoSettingToggle() {
    const { t } = useTranslation(["ui"]);
    const [auto, setAuto] = useRecoilState(autoInfoState)

    const location = useLocation();
    if (location.pathname === '/') {
        return null
    }

    return (
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
    );
}
