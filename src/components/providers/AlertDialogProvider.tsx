import { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/** Must match the CSS transition duration used in AlertDialog. */
const DIALOG_CLOSE_ANIMATION_DURATION_MS = 100;

function generateId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export interface AlertDialogOptions {
    head?: ReactNode;
    content?: ReactNode;
    onConfirm?: () => boolean | Promise<boolean>;
    onCancel?: () => void;
    disabledConfirm?: boolean;
}

interface AlertDialogItem {
    id: string;
    open: boolean;
    loading: boolean;
    options: AlertDialogOptions;
}

interface AlertDialogContextType {
    openAlertDialog: (options: AlertDialogOptions) => void;
}

const AlertDialogProviderContext = createContext<AlertDialogContextType | null>(null);

export function AlertDialogProvider({ children }: { children: ReactNode }) {
    const [dialogs, setDialogs] = useState<AlertDialogItem[]>([]);
    const { t } = useTranslation(["ui"]);

    const closeDialog = useCallback((id: string) => {
        setDialogs((prev) => prev.map((d) => (d.id === id ? { ...d, open: false } : d)));
        setTimeout(() => {
            setDialogs((prev) => prev.filter((d) => d.id !== id));
        }, DIALOG_CLOSE_ANIMATION_DURATION_MS);
    }, []);

    const openAlertDialog = useCallback((options: AlertDialogOptions) => {
        const id = generateId();
        setDialogs((prev) => [...prev, { id, open: true, loading: false, options }]);
    }, []);

    return (
        <AlertDialogProviderContext.Provider value={{ openAlertDialog }}>
            {children}
            {dialogs.map((dialog, index) => (
                <AlertDialog
                    key={dialog.id}
                    open={dialog.open && index === dialogs.length - 1}
                    onOpenChange={(open) => {
                        if (!open) {
                            dialog.options.onCancel?.();
                            closeDialog(dialog.id);
                        }
                    }}
                >
                    <AlertDialogContent>
                        {dialog.options.head && (
                            <AlertDialogHeader>
                                <AlertDialogTitle>{dialog.options.head}</AlertDialogTitle>
                            </AlertDialogHeader>
                        )}
                        {dialog.options.content && <div>{dialog.options.content}</div>}
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                            <AlertDialogAction
                                disabled={dialog.options.disabledConfirm || dialog.loading}
                                onClick={async () => {
                                    if (!dialog.options.onConfirm) {
                                        closeDialog(dialog.id);
                                        return;
                                    }
                                    setDialogs((prev) =>
                                        prev.map((d) =>
                                            d.id === dialog.id ? { ...d, loading: true } : d,
                                        ),
                                    );
                                    try {
                                        const result = await dialog.options.onConfirm();
                                        if (result) {
                                            closeDialog(dialog.id);
                                        }
                                    } finally {
                                        setDialogs((prev) =>
                                            prev.map((d) =>
                                                d.id === dialog.id ? { ...d, loading: false } : d,
                                            ),
                                        );
                                    }
                                }}
                            >
                                {t("confirm")}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            ))}
        </AlertDialogProviderContext.Provider>
    );
}

export function useAlertDialog(): AlertDialogContextType {
    const context = useContext(AlertDialogProviderContext);
    if (!context) {
        throw new Error("useAlertDialog must be used within an AlertDialogProvider");
    }
    return context;
}
