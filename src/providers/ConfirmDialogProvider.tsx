import type { ColorPaletteProp } from "@mui/joy";
import { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import ModalConfirmation from "../components/ModalConfirmation";

/** Must match the CSS transition duration used in ModalDialog. */
const DIALOG_CLOSE_ANIMATION_DURATION_MS = 400;

function generateId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export interface ConfirmDialogOptions {
    head?: ReactNode;
    content?: ReactNode;
    onConfirm?: () => boolean | Promise<boolean>;
    onCancel?: () => void;
    color?: ColorPaletteProp;
    disabledConfirm?: boolean;
}

interface ConfirmDialogItem {
    id: string;
    open: boolean;
    options: ConfirmDialogOptions;
}

interface ConfirmDialogContextType {
    openConfirmDialog: (options: ConfirmDialogOptions) => void;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(null);

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
    const [dialogs, setDialogs] = useState<ConfirmDialogItem[]>([]);

    const closeDialog = useCallback((id: string) => {
        setDialogs((prev) => prev.map((d) => (d.id === id ? { ...d, open: false } : d)));
        setTimeout(() => {
            setDialogs((prev) => prev.filter((d) => d.id !== id));
        }, DIALOG_CLOSE_ANIMATION_DURATION_MS);
    }, []);

    const openConfirmDialog = useCallback((options: ConfirmDialogOptions) => {
        const id = generateId();
        setDialogs((prev) => [...prev, { id, open: true, options }]);
    }, []);

    return (
        <ConfirmDialogContext.Provider value={{ openConfirmDialog }}>
            {children}
            {dialogs.map((dialog, index) => (
                <ModalConfirmation
                    key={dialog.id}
                    open={dialog.open && index === dialogs.length - 1}
                    setOpen={(open) => {
                        if (!open) {
                            dialog.options.onCancel?.();
                            closeDialog(dialog.id);
                        }
                    }}
                    color={dialog.options.color ?? "primary"}
                    head={dialog.options.head}
                    disabledConfirm={dialog.options.disabledConfirm}
                    onConfirm={dialog.options.onConfirm}
                >
                    {dialog.options.content}
                </ModalConfirmation>
            ))}
        </ConfirmDialogContext.Provider>
    );
}

export function useConfirmDialog(): ConfirmDialogContextType {
    const context = useContext(ConfirmDialogContext);
    if (!context) {
        throw new Error("useConfirmDialog must be used within a ConfirmDialogProvider");
    }
    return context;
}
