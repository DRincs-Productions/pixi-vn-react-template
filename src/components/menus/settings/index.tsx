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
import ReturnMainMenuButton from "@/components/ReturnMainMenuButton";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
    const { t } = useTranslation(["ui"]);

    return (
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
    );
}
