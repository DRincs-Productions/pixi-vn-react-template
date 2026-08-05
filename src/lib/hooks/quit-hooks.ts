import { useAlertDialog } from "@/components/providers/alert-dialog-provider";
import { exit } from "@tauri-apps/plugin-process";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

const isServoEmbedded = __EMBEDDED_TARGET__ === "servo";

export function useQuit() {
    const { openAlertDialog } = useAlertDialog();
    const { t } = useTranslation(["ui"]);

    const canQuit = typeof window !== "undefined" && (!!window.__TAURI__ || isServoEmbedded);

    const quit = useCallback(() => {
        openAlertDialog({
            head: t("quit"),
            content: t("quit_confirm"),
            onConfirm: async () => {
                if (isServoEmbedded) {
                    window.close();
                } else {
                    await exit();
                }
                return true;
            },
        });
    }, [openAlertDialog, t]);

    return { quit, canQuit };
}
