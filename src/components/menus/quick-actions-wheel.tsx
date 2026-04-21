import { cn } from "@/lib/utils";
import {
    type HotkeyRegistrationView,
    useHotkeyRegistrations,
    useHotkeys,
} from "@tanstack/react-hotkeys";
import { useEffect, useMemo, useRef, useState } from "react";
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
    if (registration.options.enabled === false) {
        return false;
    }
    if (registration.hotkey === "Tab") {
        return false;
    }
    return true;
}

/**
 * Registers the Tab hotkeys that open/close/execute the wheel.
 * Must NOT call `useHotkeyRegistrations` – kept in its own sibling component
 * to avoid the write→read render loop with the store.
 */
function QuickActionsWheelHotkeys({
    open,
    setOpen,
    selectedId,
    wheelItemsRef,
}: {
    open: boolean;
    setOpen: (v: boolean) => void;
    selectedId: string | undefined;
    wheelItemsRef: React.RefObject<HotkeyRegistrationView[]>;
}) {
    const { t } = useTranslation(["ui"]);

    useHotkeys([
        {
            hotkey: "Tab",
            callback: () => {
                if (!wheelItemsRef.current?.length) {
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
                const selected = wheelItemsRef.current?.find((item) => item.id === selectedId);
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

    return null;
}

/**
 * Reads active hotkey registrations and renders the radial wheel overlay.
 * Must NOT call `useHotkeys` – kept as a sibling of `QuickActionsWheelHotkeys`
 * to avoid the write→read render loop with the store.
 */
function QuickActionsWheelContent({
    open,
    setOpen,
    selectedId,
    setSelectedId,
    wheelItemsRef,
}: {
    open: boolean;
    setOpen: (v: boolean) => void;
    selectedId: string | undefined;
    setSelectedId: (id: string | undefined) => void;
    wheelItemsRef: React.RefObject<HotkeyRegistrationView[]>;
}) {
    const { t } = useTranslation(["ui"]);
    const { hotkeys } = useHotkeyRegistrations();

    const wheelItems = useMemo(() => {
        return hotkeys
            .filter(shouldShowInWheel)
            .sort((a, b) => {
                const aName = a.options.meta?.name ?? a.hotkey;
                const bName = b.options.meta?.name ?? b.hotkey;
                return aName.localeCompare(bName);
            });
    }, [hotkeys]);

    // Keep the ref in sync so QuickActionsWheelHotkeys can read it without
    // subscribing to the registrations store itself.
    useEffect(() => {
        (wheelItemsRef as React.MutableRefObject<HotkeyRegistrationView[]>).current = wheelItems;
    }, [wheelItems, wheelItemsRef]);

    useEffect(() => {
        if (!wheelItems.length) {
            setSelectedId(undefined);
            setOpen(false);
            return;
        }
        if (!selectedId || !wheelItems.some((item) => item.id === selectedId)) {
            setSelectedId(wheelItems[0]?.id);
        }
    }, [wheelItems, selectedId, setSelectedId, setOpen]);

    if (!open || !wheelItems.length) {
        return null;
    }

    const selectedRegistration =
        wheelItems.find((item) => item.id === selectedId) ?? (wheelItems[0] as HotkeyRegistrationView);
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
                            <span className="font-semibold">
                                {registration.options.meta?.name ?? registration.hotkey}
                            </span>
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

/**
 * Mounts both the hotkey registration component and the wheel display as
 * siblings so that neither causes a re-render of the other when the TanStack
 * hotkeys store changes.
 */
export default function QuickActionsWheel() {
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string>();
    const wheelItemsRef = useRef<HotkeyRegistrationView[]>([]);

    return (
        <>
            <QuickActionsWheelContent
                open={open}
                setOpen={setOpen}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                wheelItemsRef={wheelItemsRef}
            />
            <QuickActionsWheelHotkeys
                open={open}
                setOpen={setOpen}
                selectedId={selectedId}
                wheelItemsRef={wheelItemsRef}
            />
        </>
    );
}
