import { Button } from "@mui/joy";
import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import useNarrationFunctions from "../hooks/useNarrationFunctions";
import { useQueryCanGoNext } from "../hooks/useQueryInterface";
import { SkipSettings } from "../stores/skip-settings-store";
import { InterfaceStore } from "../stores/useInterfaceStore";
import { StepStore } from "../stores/useStepStore";

export default function NextButton() {
    const skipEnabled = useStore(SkipSettings.store, (state) => state.enabled);
    const nextStepLoading = useStore(StepStore.store, (state) => state.loading);
    const goBackLoading = useStore(StepStore.store, (state) => state.backLoading);
    const { data: canContinue = false } = useQueryCanGoNext();
    const hideNextButton = useStore(InterfaceStore.store, (state) => state.hidden || !canContinue);
    const { goNext } = useNarrationFunctions();
    const { t } = useTranslation(["ui"]);
    const varians = useMemo(
        () =>
            hideNextButton
                ? `motion-opacity-out-0 motion-translate-y-out-[50%]`
                : `motion-opacity-in-0 motion-translate-y-in-[50%]`,
        [hideNextButton],
    );

    return (
        <Button
            variant="solid"
            color="primary"
            size="sm"
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
                    SkipSettings.setEnabled(false);
                }
                goNext();
            }}
            className={varians}
        >
            {t("next")}
        </Button>
    );
}
