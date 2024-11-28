import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Typography } from "@mui/joy";
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { hideInterfaceState } from '../../atoms/hideInterfaceState';
import SettingButton from '../../components/SettingButton';

export default function HideInterfaceSettingToggle() {
    const { t } = useTranslation(["ui"]);
    const [hideInterface, setHideInterface] = useRecoilState(hideInterfaceState);

    const location = useLocation();
    if (location.pathname === '/') {
        return null
    }

    return (
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
    );
}
