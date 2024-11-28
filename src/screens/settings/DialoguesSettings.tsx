import { Box, FormHelperText, FormLabel, Slider } from "@mui/joy";
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { autoInfoState } from "../../atoms/autoInfoState";
import { typewriterDelayState } from "../../atoms/typewriterDelayState";

export default function DialoguesSettings() {
    const [typewriterDelay, setTypewriterDelay] = useRecoilState(typewriterDelayState)
    const { t } = useTranslation(["ui"]);
    const [auto, setAuto] = useRecoilState(autoInfoState)

    return (
        <>
            <Box>
                <FormLabel sx={{ typography: 'title-sm' }}>
                    {t("text_speed")}
                </FormLabel>
                <FormHelperText sx={{ typography: 'body-sm' }}>
                    {t("text_speed_description")}
                </FormHelperText>
            </Box>
            <Box
                sx={{
                    paddingX: 3,
                }}
            >
                <Slider
                    defaultValue={typewriterDelay}
                    getAriaValueText={(value) => `${value}ms`}
                    step={10}
                    marks={[
                        {
                            value: 0,
                            label: t('off'),
                        },
                        {
                            value: 200,
                            label: '200ms',
                        },
                    ]}
                    valueLabelDisplay="on"
                    max={200}
                    min={0}
                    valueLabelFormat={(index) => {
                        if (index === 0) return t('off')
                        return `${index}ms`
                    }}

                    onChange={(_, value) => {
                        setTypewriterDelay(value as number || 0)
                    }}
                />
            </Box>
            <Box>
                <FormLabel sx={{ typography: 'title-sm' }}>
                    {t("auto_forward_time")}
                </FormLabel>
                <FormHelperText sx={{ typography: 'body-sm' }}>
                    {t("auto_forward_time_description", { autoName: t("auto_forward_time_restricted"), textSpeedName: t("text_speed") })}
                </FormHelperText>
            </Box>
            <Box
                sx={{
                    paddingX: 3,
                }}
            >
                <Slider
                    defaultValue={auto.time}
                    getAriaValueText={(value) => `${value}s`}
                    step={1}
                    marks={[
                        {
                            value: 1,
                            label: '1s',
                        },
                        {
                            value: 10,
                            label: '10s',
                        },
                    ]}
                    valueLabelDisplay="on"
                    max={10}
                    min={1}
                    disabled={!auto}
                    valueLabelFormat={(index) => index + "s"}
                    onChange={(_, value) => {
                        if (value)
                            setAuto((prev) => ({
                                ...prev,
                                time: value as number
                            }))
                    }}
                />
            </Box>
        </>
    );
}
