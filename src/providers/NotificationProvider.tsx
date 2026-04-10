import { CheckCircle2, Info, TriangleAlert, XCircle } from "lucide-react";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export type NotificationVariant = "default" | "error" | "success" | "warning" | "info";

export interface NotificationOptions {
    variant?: NotificationVariant;
    autoHideDuration?: number;
}

interface NotificationItem {
    id: string;
    message: ReactNode;
    variant: NotificationVariant;
    autoHideDuration: number;
    visible: boolean;
}

export interface NotificationContextType {
    enqueueSnackbar: (message: ReactNode, options?: NotificationOptions) => string;
}

const DEFAULT_DURATION = 3000;
const EXIT_ANIMATION_MS = 300;

let _idCounter = 0;
function generateId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `notification-${++_idCounter}`;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const VARIANT_STYLES: Record<NotificationVariant, string> = {
    default: "",
    success: "border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300",
    error: "border-destructive bg-red-50 text-destructive dark:bg-red-950",
    warning: "border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
    info: "border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
};

const VARIANT_ICONS: Record<NotificationVariant, ReactNode | null> = {
    default: null,
    success: <CheckCircle2 />,
    error: <XCircle />,
    warning: <TriangleAlert />,
    info: <Info />,
};

function NotificationToast({ item, onDismiss }: { item: NotificationItem; onDismiss: (id: string) => void }) {
    useEffect(() => {
        const timer = setTimeout(() => onDismiss(item.id), item.autoHideDuration);
        return () => clearTimeout(timer);
    }, [item.id, item.autoHideDuration, onDismiss]);

    return (
        <div
            className={cn(
                "transition-all duration-300",
                item.visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full",
            )}
        >
            <Alert className={cn("shadow-md", VARIANT_STYLES[item.variant])}>
                {VARIANT_ICONS[item.variant]}
                <span>{item.message}</span>
            </Alert>
        </div>
    );
}

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    const dismiss = useCallback((id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, visible: false } : n)));
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, EXIT_ANIMATION_MS);
    }, []);

    const enqueueSnackbar = useCallback((message: ReactNode, options?: NotificationOptions): string => {
        const id = generateId();
        const variant = options?.variant ?? "default";
        const autoHideDuration = options?.autoHideDuration ?? DEFAULT_DURATION;
        setNotifications((prev) => [...prev, { id, message, variant, autoHideDuration, visible: true }]);
        return id;
    }, []);

    return (
        <NotificationContext.Provider value={{ enqueueSnackbar }}>
            {children}
            <div
                role="status"
                aria-live="polite"
                className="fixed top-4 left-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]"
            >
                {notifications.map((n) => (
                    <NotificationToast key={n.id} item={n} onDismiss={dismiss} />
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

export function useSnackbar(): NotificationContextType {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error("useSnackbar must be used within a NotificationProvider");
    }
    return ctx;
}
