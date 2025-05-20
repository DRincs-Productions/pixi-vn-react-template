import { Button } from "@mui/joy";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import useNarrationFunctions from "../hooks/useNarrationFunctions";
import useInterfaceStore from "../stores/useInterfaceStore";
import useSkipStore from "../stores/useSkipStore";
import useStepStore from "../stores/useStepStore";
import { useQueryCanGoNext } from "../use_query/useQueryInterface";

export default function NextButton() {
    const skipEnabled = useSkipStore((state) => state.enabled);
    const setSkipEnabled = useSkipStore((state) => state.setEnabled);
    const nextStepLoading = useStepStore((state) => state.loading);
    const goBackLoading = useStepStore((state) => state.backLoading);
    const { data: canGoNext = false } = useQueryCanGoNext();
    const hideNextButton = useInterfaceStore((state) => state.hidden || !canGoNext);
    const { goNext } = useNarrationFunctions();
    const { t } = useTranslation(["ui"]);
    const varians = useMemo(
        () =>
            hideNextButton
                ? `motion-opacity-out-0 motion-translate-y-out-[50%]`
                : `motion-opacity-in-0 motion-translate-y-in-[50%]`,
        [hideNextButton]
    );

    return (
        <Button
            variant='solid'
            color='primary'
            size='sm'
            disabled={goBackLoading}
            loading={nextStepLoading}
            sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: { xs: 70, sm: 100, md: 150 },
                border: 3,
                zIndex: 100,
            }}
            onClick={() => {
                if (skipEnabled) {
                    setSkipEnabled(false);
                }
                goNext();
            }}
            className={varians}
        >
            {t("next")}
        </Button>
    );
}
