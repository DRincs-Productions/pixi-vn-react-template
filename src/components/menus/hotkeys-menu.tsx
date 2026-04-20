import { Dialog, FullscreenDialogContent } from "@/components/ui/fullscreen-dialog";
import { Input } from "@/components/ui/input";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchParamState, useSetSearchParamState } from "@/hooks/useSearchParamState";
import { cn } from "@/lib/utils";
import {
    type HotkeyRegistrationView,
    useHotkeyRegistrations,
    useHotkeys,
} from "@tanstack/react-hotkeys";
import { Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

function splitHotkey(hotkey: string) {
    return hotkey.split("+").filter(Boolean);
}

function isRegistrationEnabled(registration: HotkeyRegistrationView) {
    return registration.options.enabled !== false;
}

export default function HotkeysMenu() {
    const open = useSearchParamState<boolean>("hotkeys");
    const setOpen = useSetSearchParamState<boolean>("hotkeys");
    const { hotkeys } = useHotkeyRegistrations();
    const [searchString, setSearchString] = useState("");
    const { t } = useTranslation(["ui"]);

    const toggleOpen = useCallback(() => {
        setOpen(open ? undefined : true);
    }, [open, setOpen]);

    useHotkeys([
        {
            hotkey: "Control+K",
            callback: toggleOpen,
            options: {
                meta: {
                    name: t("hotkeys_menu"),
                    description: t("hotkeys_menu_shortcut_description"),
                },
            },
        },
    ]);

    const normalizedSearch = searchString.trim().toLowerCase();
    const hotkeyRows = useMemo(() => {
        return hotkeys
            .filter((registration) => {
                if (!normalizedSearch) {
                    return true;
                }
                const name = registration.options.meta?.name?.toLowerCase() ?? "";
                const description = registration.options.meta?.description?.toLowerCase() ?? "";
                const value = registration.hotkey.toLowerCase();
                return (
                    name.includes(normalizedSearch) ||
                    description.includes(normalizedSearch) ||
                    value.includes(normalizedSearch)
                );
            })
            .sort((a, b) => {
                const aName = a.options.meta?.name ?? a.hotkey;
                const bName = b.options.meta?.name ?? b.hotkey;
                return aName.localeCompare(bName);
            });
    }, [hotkeys, normalizedSearch]);

    const toolbar = (
        <div className="relative w-72 max-w-[50vw]">
            <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                className="pl-8"
                placeholder={t("search")}
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                aria-label={t("search")}
            />
        </div>
    );

    return (
        <Dialog open={open ?? false} onOpenChange={(isOpen) => setOpen(isOpen || undefined)}>
            <FullscreenDialogContent title={t("hotkeys_menu")} toolbar={toolbar} centered>
                <ScrollArea className="flex-1 min-h-0">
                    <div className="p-4 space-y-2">
                        {hotkeyRows.map((registration) => {
                            const label = registration.options.meta?.name ?? registration.hotkey;
                            const description =
                                registration.options.meta?.description ?? t("hotkeys_menu_no_description");
                            const enabled = isRegistrationEnabled(registration);
                            return (
                                <div
                                    key={registration.id}
                                    className="flex flex-col gap-3 rounded-lg border bg-card/80 p-3 sm:flex-row sm:items-center"
                                >
                                    <div className="flex-1 space-y-1">
                                        <p className="font-medium">{label}</p>
                                        <p className="text-sm text-muted-foreground">{description}</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                                        <KbdGroup>
                                            {splitHotkey(registration.hotkey).map((part) => (
                                                <Kbd key={`${registration.id}-${part}`}>{part}</Kbd>
                                            ))}
                                        </KbdGroup>
                                        <span
                                            className={cn(
                                                "rounded-full px-2 py-0.5 text-xs font-medium border",
                                                enabled
                                                    ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
                                                    : "border-muted-foreground/30 bg-muted text-muted-foreground",
                                            )}
                                        >
                                            {enabled ? t("hotkeys_menu_active") : t("hotkeys_menu_inactive")}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        {hotkeyRows.length === 0 && (
                            <p className="text-sm text-muted-foreground">{t("hotkeys_menu_no_results")}</p>
                        )}
                    </div>
                </ScrollArea>
            </FullscreenDialogContent>
        </Dialog>
    );
}
