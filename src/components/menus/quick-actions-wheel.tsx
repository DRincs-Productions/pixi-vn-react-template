import { cn } from "@/lib/utils";
import {
    type HotkeyRegistrationView,
    useHotkeyRegistrations,
    useHotkeys,
} from "@tanstack/react-hotkeys";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

function dispatchKeyboardEvent(
    target: HTMLElement | Document | Window,
    type: "keydown" | "keyup",
    registration: HotkeyRegistrationView,
) {
    const { parsedHotkey } = registration;
    target.dispatchEvent(
        new KeyboardEvent(type, {
            key: parsedHotkey.key,
            ctrlKey: parsedHotkey.ctrl,
            shiftKey: parsedHotkey.shift,
            altKey: parsedHotkey.alt,
            metaKey: parsedHotkey.meta,
            bubbles: true,
            cancelable: true,
        }),
    );
}

function triggerRegistration(registration: HotkeyRegistrationView) {
    const eventType = registration.options.eventType ?? "keydown";
    dispatchKeyboardEvent(registration.target, eventType, registration);
    if (eventType === "keydown") {
        dispatchKeyboardEvent(registration.target, "keyup", registration);
    }
}

function shouldShowInWheel(registration: HotkeyRegistrationView) {
    const enabled = registration.options.enabled !== false;
    if (!enabled) {
        return false;
    }
    if (registration.hotkey === "Tab") {
        return false;
    }
    return true;
}

export default function QuickActionsWheel() {
    const { t } = useTranslation(["ui"]);
    const { hotkeys } = useHotkeyRegistrations();
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string>();

    const wheelItems = useMemo(() => {
        return hotkeys
            .filter(shouldShowInWheel)
            .sort((a, b) => {
                const aName = a.options.meta?.name ?? a.hotkey;
                const bName = b.options.meta?.name ?? b.hotkey;
                return aName.localeCompare(bName);
            });
    }, [hotkeys]);

    useEffect(() => {
        if (!wheelItems.length) {
            setSelectedId(undefined);
            setOpen(false);
            return;
        }
        if (!selectedId || !wheelItems.some((item) => item.id === selectedId)) {
            setSelectedId(wheelItems[0]?.id);
        }
    }, [wheelItems, selectedId]);

    useHotkeys([
        {
            hotkey: "Tab",
            callback: () => {
                if (!wheelItems.length) {
                    return;
                }
                setOpen(true);
            },
            options: {
                enabled: !open,
                meta: {
                    name: t("quick_actions"),
                    description: t("quick_actions_open_description"),
                },
            },
        },
        {
            hotkey: "Tab",
            callback: () => {
                if (!open || !selectedId) {
                    setOpen(false);
                    return;
                }
                const selected = wheelItems.find((item) => item.id === selectedId);
                if (selected) {
                    triggerRegistration(selected);
                }
                setOpen(false);
            },
            options: {
                eventType: "keyup",
                enabled: open,
                meta: {
                    name: t("quick_actions_execute"),
                    description: t("quick_actions_execute_description"),
                },
            },
        },
    ]);

    if (!open || !wheelItems.length) {
        return null;
    }

    const selectedRegistration = wheelItems.find((item) => item.id === selectedId) ?? wheelItems[0];
    const radius = 130;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <div className="relative size-[360px] rounded-full border border-primary/20 bg-background/90 shadow-xl">
                {wheelItems.map((registration, index) => {
                    const angle = (index / wheelItems.length) * Math.PI * 2 - Math.PI / 2;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    const selected = registration.id === selectedRegistration.id;
                    return (
                        <button
                            key={registration.id}
                            type="button"
                            className={cn(
                                "absolute top-1/2 left-1/2 flex w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-md border p-2 text-center text-xs transition-colors",
                                selected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-card/90 text-card-foreground hover:border-primary/60",
                            )}
                            style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                            onMouseEnter={() => setSelectedId(registration.id)}
                        >
                            <span className="font-semibold">{registration.options.meta?.name ?? registration.hotkey}</span>
                            <span className="text-[11px] opacity-85">{registration.hotkey}</span>
                        </button>
                    );
                })}

                <div className="absolute top-1/2 left-1/2 flex w-42 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-full border bg-card p-4 text-center">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        {t("quick_actions")}
                    </span>
                    <span className="text-sm font-semibold">
                        {selectedRegistration.options.meta?.name ?? selectedRegistration.hotkey}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {selectedRegistration.options.meta?.description ??
                            t("hotkeys_menu_no_description")}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                        {t("quick_actions_release_hint")}
                    </span>
                </div>
            </div>
        </div>
    );
}
