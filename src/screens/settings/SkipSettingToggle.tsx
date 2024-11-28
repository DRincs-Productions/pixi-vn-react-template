import FastForwardIcon from '@mui/icons-material/FastForward';
import { Typography } from "@mui/joy";
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { skipEnabledState } from '../../atoms/skipEnabledState';
import SettingButton from '../../components/SettingButton';

export default function SkipSettingToggle() {
    const { t } = useTranslation(["ui"]);
    const [skip, setSkip] = useRecoilState(skipEnabledState)

    const location = useLocation();
    if (location.pathname === '/') {
        return null
    }

    return (
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
    );
}
