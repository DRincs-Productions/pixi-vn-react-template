import { useAlertDialog } from "@/components/providers/alert-dialog-provider";
import { exit as exitRoves } from "@drincs/roves-api/process";
import { exit as exitTauri } from "@tauri-apps/plugin-process";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

const isRovesEmbedded = __EMBEDDED_TARGET__ === "roves";

export function useQuit() {
    const { openAlertDialog } = useAlertDialog();
    const { t } = useTranslation(["ui"]);

    const canQuit = typeof window !== "undefined" && (!!window.__TAURI__ || isRovesEmbedded);

    const quit = useCallback(() => {
        openAlertDialog({
            head: t("quit"),
            content: t("quit_confirm"),
            onConfirm: async () => {
                if (isRovesEmbedded) {
                    await exitRoves();
                } else {
                    await exitTauri();
                }
                return true;
            },
        });
    }, [openAlertDialog, t]);

    return { quit, canQuit };
}
