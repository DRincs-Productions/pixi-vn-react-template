import { useAlertDialog } from "@/components/providers/alert-dialog-provider";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function useQuit() {
    const { openAlertDialog } = useAlertDialog();
    const { t } = useTranslation(["ui"]);

    const canQuit = typeof window !== "undefined" && !!window.__TAURI__;

    const quit = useCallback(() => {
        openAlertDialog({
            head: t("quit"),
            content: t("quit_confirm"),
            onConfirm: async () => {
                await getCurrentWindow().close();
                return true;
            },
        });
    }, [openAlertDialog, t]);

    return { quit, canQuit };
}
