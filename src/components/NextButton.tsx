import { Button } from "@mui/joy";
import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import useNarrationFunctions from "../hooks/useNarrationFunctions";
import { useQueryCanGoNext } from "../hooks/useQueryInterface";
import { GameStatus } from "../stores/game-status-store";
import { InterfaceSettings } from "../stores/interface-settings-store";
import { SkipSettings } from "../stores/skip-settings-store";

export default function NextButton() {
    const skipEnabled = useStore(SkipSettings.store, (state) => state.enabled);
    const gameLoading = useStore(GameStatus.store, (state) => state.loading);
    const { data: canContinue = false } = useQueryCanGoNext();
    const hideNextButton = useStore(InterfaceSettings.store, (state) => state.hidden || !canContinue);
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
            disabled={gameLoading}
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
