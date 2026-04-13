import { useHotkeys } from "@tanstack/react-hotkeys";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import packageJson from "@/../package.json";
import AutoSettingToggle from "@/components/menus/settings/AutoSettingToggle";
import DialoguesSettings from "@/components/menus/settings/DialoguesSettings";
import DownloadFileToTranslateSettingButton from "@/components/menus/settings/DownloadFileToTranslateSettingButton";
import FullScreenSettings from "@/components/menus/settings/FullScreenSettings";
import HideInterfaceSettingToggle from "@/components/menus/settings/HideInterfaceSettingToggle";
import OpenHistorySettingButton from "@/components/menus/settings/OpenHistorySettingButton";
import SaveLoadSettingButtons from "@/components/menus/settings/SaveLoadSettingButtons";
import SkipSettingToggle from "@/components/menus/settings/SkipSettingToggle";
import SoundSettings from "@/components/menus/settings/SoundSettings";
import ThemeSettings from "@/components/menus/settings/ThemeSettings";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useSearchParamState, useSetSearchParamState } from "../../../hooks/useSearchParamState";
import ReturnMainMenuButton from "../../ReturnMainMenuButton";

export default function Settings() {
    const open = useSearchParamState<boolean>("settings");
    const setOpen = useSetSearchParamState<boolean>("settings");
    const { t } = useTranslation(["ui"]);

    const toggleOpen = useCallback(() => {
        setOpen(open ? undefined : true);
    }, [open, setOpen]);

    useHotkeys([
        {
            hotkey: "Escape",
            callback: toggleOpen,
        },
    ]);

    return (
        <Dialog open={open ?? false} onOpenChange={(isOpen) => setOpen(isOpen || undefined)}>
            <DialogContent className="top-0 left-0 flex h-full max-h-full w-full max-w-full translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 p-0">
                {/* Fixed header */}
                <div className="flex shrink-0 items-center border-b px-4 py-2 pr-12">
                    <DialogTitle>{t("settings")}</DialogTitle>
                </div>

                {/* Single scrollable body */}
                <div className="flex-1 overflow-auto">
                    {/* Two-column grid on md+, single column list below md */}
                    <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x">
                        {/* Left column: quick actions */}
                        <div className="border-b p-4 md:border-b-0">
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                {t("quick_actions")}
                            </h3>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <SkipSettingToggle />
                                <AutoSettingToggle />
                                <OpenHistorySettingButton />
                                <SaveLoadSettingButtons />
                                <HideInterfaceSettingToggle />
                                <DownloadFileToTranslateSettingButton />
                            </div>
                            <Separator className="my-4" />
                            <ReturnMainMenuButton />
                        </div>

                        {/* Right column: settings sections */}
                        <div className="border-b p-4 md:border-b-0">
                            <div className="grid gap-4">
                                <div>
                                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                        {t("dialogues")}
                                    </h3>
                                    <DialoguesSettings />
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                        {t("sound")}
                                    </h3>
                                    <SoundSettings />
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                        {t("display")}
                                    </h3>
                                    <FullScreenSettings />
                                    <ThemeSettings />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Game info section at the bottom, full width */}
                    <div className="border-t p-4">
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            {t("about")}
                        </h3>
                        <p className="text-sm font-semibold">{packageJson.name}</p>
                        <p className="text-sm text-muted-foreground">v{packageJson.version}</p>
                        <p className="text-sm text-muted-foreground">
                            {t("generated_with_engine", { engine: "Pixi'VN" })}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
