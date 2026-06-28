import { QuickActionsWheelState } from "@/lib/stores/quick-actions-wheel-store";
import { cn } from "@/lib/utils";
import { getHotkeyManager, toHotkeyRegistrationView } from "@tanstack/hotkeys";
import type { HotkeyRegistrationView } from "@tanstack/react-hotkeys";
import { useSelector } from "@tanstack/react-store";
import { type MouseEvent, useMemo, useRef, useState } from "react";
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
 * Reads active hotkey registrations and renders the radial wheel overlay.
 */
function QuickActionsWheelContent({
    open,
    selectedId,
    setSelectedId,
}: {
    open: boolean;
    selectedId: string | undefined;
    setSelectedId: (id: string | undefined) => void;
}) {
    const { t } = useTranslation(["ui"]);
    const wheelContainerRef = useRef<HTMLDivElement>(null);

    const wheelItems = useMemo(() => {
        if (!open) {
            return [];
        }
        const hotkeys = Array.from(getHotkeyManager().registrations.state.values()).map(
            toHotkeyRegistrationView,
        );
        return buildWheelItems(hotkeys);
    }, [open]);

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
        QuickActionsWheelState.setOpen(false);
    };

    return (
        <div
            role="presentation"
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
                                QuickActionsWheelState.setOpen(false);
                            }}
                        >
                            <span className="font-semibold">{registration.label}</span>
                            <span className="text-[11px] opacity-85">
                                {registration.hotkeyLabel.length > 15
                                    ? `${registration.hotkeyLabel.slice(0, 15)}…`
                                    : registration.hotkeyLabel}
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
 * Mounts the wheel display and reads state from the shared store.
 */
export function QuickActionsWheel() {
    const open = useSelector(QuickActionsWheelState.store, (state) => state.open);
    const [selectedId, setSelectedId] = useState<string>();

    return (
        <div className="pointer-events-auto">
            <QuickActionsWheelContent
                open={open}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
            />
        </div>
    );
}
