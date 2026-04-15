import packageJson from "@/../package.json";
import { DialoguesControls } from "@/components/menus/settings/dialogues-controls";
import { QuickMenus } from "@/components/menus/settings/quick-menus";
import { SoundControls } from "@/components/menus/settings/sound-controls";
import { SystemControls } from "@/components/menus/settings/system-controls";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

export default function Settings() {
    const { t } = useTranslation(["ui"]);

    return (
        <div className="flex-1 overflow-auto">
            {/* Two-column grid on md+, single column list below md */}
            <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x px-2 sm:px-12 md:px-14 lg:px-22 xl:px-28">
                {/* Left column: quick actions */}
                <div className="border-b p-4 md:border-b-0">
                    <div>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            {t("system")}
                        </h3>
                        <SystemControls />
                    </div>
                    <Separator className="my-4" />
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        {t("menus")}
                    </h3>
                    <QuickMenus />
                </div>

                {/* Right column: settings sections */}
                <div className="border-b p-4 md:border-b-0">
                    <div className="grid gap-4">
                        <div>
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                {t("dialogues")}
                            </h3>
                            <DialoguesControls />
                        </div>

                        <Separator />

                        <div>
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                {t("sound")}
                            </h3>
                            <SoundControls />
                        </div>
                    </div>
                </div>
            </div>

            {/* Game info section at the bottom, full width */}
            <div className="border-t p-4 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-28">
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
