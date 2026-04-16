import { About } from "@/components/menus/settings/about";
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
                    <div className="grid gap-4">
                        <div>
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                {t("system")}
                            </h3>
                            <SystemControls />
                        </div>

                        <Separator />

                        <div>
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                {t("sound")}
                            </h3>
                            <SoundControls />
                        </div>

                        <Separator />

                        <div>
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                {t("about")}
                            </h3>
                            <About />
                        </div>
                    </div>
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
                                {t("menus")}
                            </h3>
                            <QuickMenus />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
