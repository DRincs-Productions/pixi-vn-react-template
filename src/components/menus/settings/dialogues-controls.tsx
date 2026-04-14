import { useLocation } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { ChevronsRightIcon, TimerIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { AutoSettings } from "@/lib/stores/auto-settings-store";
import { SkipSettings } from "@/lib/stores/skip-settings-store";
import { TypewriterSettings } from "@/lib/stores/typewriter-settings-store";

export function DialoguesControls() {
    const typewriterDelay = useStore(TypewriterSettings.store, (state) => state.delay);
    const { t } = useTranslation(["ui"]);
    const autoEnabled = useStore(AutoSettings.store, (state) => state.enabled);
    const autoTime = useStore(AutoSettings.store, (state) => state.time);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <div>
                    <p className="text-sm font-medium leading-none">{t("text_speed")}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {t("text_speed_description")}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Slider
                        min={0}
                        max={200}
                        step={10}
                        value={[typewriterDelay]}
                        onValueChange={(v) =>
                            typeof v === "number" && TypewriterSettings.setDelay(v)
                        }
                        className="flex-1"
                    />
                    <span className="w-14 text-right text-xs tabular-nums">
                        {typewriterDelay === 0 ? t("off") : `${typewriterDelay}ms`}
                    </span>
                </div>
                <div className="flex justify-between px-1 text-xs text-muted-foreground">
                    <span>{t("off")}</span>
                    <span>200ms</span>
                </div>
            </div>

            <AutoForwardToggle />
            <div className="flex flex-col gap-1.5">
                <div>
                    <p className="text-sm font-medium leading-none">{t("auto_forward_time")}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {t("auto_forward_time_description", {
                            autoName: t("auto_forward_time_restricted"),
                            textSpeedName: t("text_speed"),
                        })}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[autoTime]}
                        onValueChange={(v) => typeof v === "number" && AutoSettings.setTime(v)}
                        disabled={!autoEnabled}
                        className="flex-1"
                    />
                    <span className="w-14 text-right text-xs tabular-nums">{autoTime}s</span>
                </div>
                <div className="flex justify-between px-1 text-xs text-muted-foreground">
                    <span>1s</span>
                    <span>10s</span>
                </div>
            </div>
            <SkipToggle />
        </div>
    );
}

export function AutoForwardToggle() {
    const { t } = useTranslation(["ui"]);
    const autoEnabled = useStore(AutoSettings.store, (state) => state.enabled);

    const location = useLocation();
    if (location.pathname === "/") {
        return null;
    }

    return (
        <Toggle
            variant="outline"
            pressed={autoEnabled}
            onPressedChange={AutoSettings.toggleEnabled}
            className="h-auto w-full flex-col gap-1 py-3"
        >
            <TimerIcon className="size-5" />
            <span className="text-xs font-medium">{t("auto_forward_time_restricted")}</span>
        </Toggle>
    );
}

export function SkipToggle() {
    const { t } = useTranslation(["ui"]);
    const enabled = useStore(SkipSettings.store, (state) => state.enabled);

    const location = useLocation();
    if (location.pathname === "/") {
        return null;
    }

    return (
        <Toggle
            pressed={enabled}
            onPressedChange={SkipSettings.setEnabled}
            className="h-auto w-full flex-col gap-1 py-3"
        >
            <ChevronsRightIcon className="size-5" />
            <span className="text-xs font-medium">{t("skip")}</span>
            <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
                Space
            </kbd>
        </Toggle>
    );
}
