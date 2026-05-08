import { cn } from "@/lib/utils";
import {
    type HotkeyRegistrationView,
    useHotkeyRegistrations,
    useHotkeys,
} from "@tanstack/react-hotkeys";
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
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

type WheelActionItem = {
    id: string;
    label: string;
    description: string;
    hotkeyLabel: string;
    registration: HotkeyRegistrationView;
};

function getRegistrationGroupKey(registration: HotkeyRegistrationView) {
    const name = registration.options.meta?.name?.trim();
    const eventType = registration.options.eventType ?? "keydown";

    if (!name) {
        return `single:${registration.id}`;
    }

    // Group by action name and event type so aliases with different wording
    // (e.g. hold/release variants) are merged into one wheel action.
    return `meta:${name}::${eventType}`;
}

function buildWheelItems(hotkeys: HotkeyRegistrationView[]): WheelActionItem[] {
    const grouped = new Map<string, HotkeyRegistrationView[]>();

    for (const registration of hotkeys.filter(shouldShowInWheel)) {
        const key = getRegistrationGroupKey(registration);
        const existing = grouped.get(key);
        if (existing) {
            existing.push(registration);
        } else {
            grouped.set(key, [registration]);
        }
    }

    return Array.from(grouped.values())
        .map((group) => {
            const registration = group.find((item) => item.options.enabled !== false) ?? group[0];
            const label = registration.options.meta?.name ?? registration.hotkey;
            const description = registration.options.meta?.description ?? "";
            const hotkeyLabel = Array.from(new Set(group.map((item) => item.hotkey))).join(" OR ");

            return {
                id: `group:${group
                    .map((item) => item.id)
                    .sort()
                    .join("|")}`,
                label,
                description,
                hotkeyLabel,
                registration,
            };
        })
        .sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Registers the Tab hotkey that toggles the wheel open/closed.
 * Must NOT call `useHotkeyRegistrations` – kept in its own sibling component
 * to avoid the write→read render loop with the store.
 */
function QuickActionsWheelHotkeys({
    open,
    setOpen,
    wheelItemsRef,
}: {
    open: boolean;
    setOpen: (v: boolean) => void;
    wheelItemsRef: React.RefObject<WheelActionItem[]>;
}) {
    const { t } = useTranslation(["ui"]);

    useHotkeys([
        {
            hotkey: "Tab",
            callback: () => {
                if (open) {
                    setOpen(false);
                    return;
                }
                if (wheelItemsRef.current?.length) {
                    setOpen(true);
                }
            },
            options: {
                meta: {
                    name: t("quick_actions"),
                    description: t("quick_actions_open_description"),
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
    wheelItemsRef: React.RefObject<WheelActionItem[]>;
}) {
    const { t } = useTranslation(["ui"]);
    const { hotkeys } = useHotkeyRegistrations();
    const wheelContainerRef = useRef<HTMLDivElement>(null);

    const wheelItems = useMemo(() => {
        return buildWheelItems(hotkeys);
    }, [hotkeys]);

    // Keep the ref in sync so QuickActionsWheelHotkeys can read it without
    // subscribing to the registrations store itself.
    useEffect(() => {
        (wheelItemsRef as React.MutableRefObject<WheelActionItem[]>).current = wheelItems;
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
        wheelItems.find((item) => item.id === selectedId) ?? (wheelItems[0] as WheelActionItem);
    const radius = Math.min(168, Math.max(135, 120 + wheelItems.length * 3));

    const getRegistrationForPointer = (clientX: number, clientY: number) => {
        if (!wheelItems.length) {
            return undefined;
        }

        const rect = wheelContainerRef.current?.getBoundingClientRect();
        const centerX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
        const centerY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
        const dx = clientX - centerX;
        const dy = clientY - centerY;

        if (dx === 0 && dy === 0) {
            return selectedRegistration;
        }

        const pointerAngle = Math.atan2(dy, dx);
        const step = (Math.PI * 2) / wheelItems.length;
        const normalizedAngle = (pointerAngle + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
        const index = Math.round(normalizedAngle / step) % wheelItems.length;

        return wheelItems[index];
    };

    const selectRegistrationFromPointer = (clientX: number, clientY: number) => {
        const registration = getRegistrationForPointer(clientX, clientY);
        if (registration && registration.id !== selectedRegistration.id) {
            setSelectedId(registration.id);
        }
        return registration;
    };

    const handleOverlayMouseMove = (event: MouseEvent<HTMLDivElement>) => {
        if ((event.target as HTMLElement).closest("button")) {
            return;
        }
        selectRegistrationFromPointer(event.clientX, event.clientY);
    };

    const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
        if ((event.target as HTMLElement).closest("button")) {
            return;
        }

        const registration = selectRegistrationFromPointer(event.clientX, event.clientY);
        if (!registration) {
            return;
        }

        triggerRegistration(registration.registration);
        setOpen(false);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs"
            onMouseMove={handleOverlayMouseMove}
            onClick={handleOverlayClick}
        >
            <div
                ref={wheelContainerRef}
                className="relative h-[350px] w-[390px] rounded-[9999px] border border-primary/20 bg-background/90 shadow-xl"
            >
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
                                "absolute flex w-28 flex-col items-center rounded-md border p-2 text-center text-xs transition-colors",
                                selected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-card/90 text-card-foreground hover:border-primary/60",
                            )}
                            style={{
                                left: `calc(50% + ${x}px)`,
                                top: `calc(50% + ${y}px)`,
                                transform: "translate(-50%, -50%)",
                            }}
                            onMouseEnter={() => setSelectedId(registration.id)}
                            onClick={(event) => {
                                event.stopPropagation();
                                triggerRegistration(registration.registration);
                                setOpen(false);
                            }}
                        >
                            <span className="font-semibold">{registration.label}</span>
                            <span className="text-[11px] opacity-85">
                                {registration.hotkeyLabel}
                            </span>
                        </button>
                    );
                })}

                <div className="absolute top-1/2 left-1/2 flex w-44 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-full border bg-card p-4 text-center">
                    <span className="text-sm font-semibold">{selectedRegistration.label}</span>
                    <span className="text-xs text-muted-foreground">
                        {selectedRegistration.description || t("hotkeys_menu_no_description")}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                        {t("quick_actions_click_hint")}
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
export function QuickActionsWheel() {
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string>();
    const wheelItemsRef = useRef<WheelActionItem[]>([]);

    return (
        <div className="pointer-events-auto">
            <QuickActionsWheelContent
                open={open}
                setOpen={setOpen}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                wheelItemsRef={wheelItemsRef}
            />
            <QuickActionsWheelHotkeys open={open} setOpen={setOpen} wheelItemsRef={wheelItemsRef} />
        </div>
    );
}
