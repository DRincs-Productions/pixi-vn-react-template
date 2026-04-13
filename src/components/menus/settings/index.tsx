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
        <Dialog open={open ?? false} onOpenChange={(isOpen) => setOpen(isOpen || undefined)}
        >
            <DialogContent
                className={
                    "top-0 left-0 flex h-full max-h-full w-full max-w-full translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0"
                }
            >
                <div className="flex shrink-0 items-center justify-between border-b px-4 py-2 pr-12">
                    <DialogTitle>{t("settings")}</DialogTitle>
                    <div className="text-right text-xs text-muted-foreground">
                        <p className="font-semibold text-foreground">{packageJson.name}</p>
                        <p>v{packageJson.version}</p>
                    </div>
                </div>

                <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
                    <div className="min-h-0 overflow-auto border-b p-4 lg:border-r lg:border-b-0">
                        <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Quick Actions
                        </div>
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

                    <div className="min-h-0 overflow-auto p-4">
                        <div className="grid gap-4">
                            <div className="rounded-lg border p-3">
                                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    {t("dialogues")}
                                </h3>
                                <DialoguesSettings />
                            </div>

                            <div className="rounded-lg border p-3">
                                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    {t("sound")}
                                </h3>
                                <SoundSettings />
                            </div>

                            <div className="rounded-lg border p-3">
                                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    {t("display")}
                                </h3>
                                <FullScreenSettings />
                                <ThemeSettings />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground">
                    <p>{packageJson.name}</p>
                    <p>Generated with Pixi&apos;VN Engine</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
