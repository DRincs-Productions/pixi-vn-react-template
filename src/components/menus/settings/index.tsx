import { About } from "@/components/menus/settings/about";
import { DialoguesControls } from "@/components/menus/settings/dialogues-controls";
import { ControlsListSettingsPage } from "@/components/menus/settings/menus/controls";
import { HistoryListSettingsPage } from "@/components/menus/settings/menus/history";
import { QuickMenus } from "@/components/menus/settings/quick-menus";
import { SoundControls } from "@/components/menus/settings/sound-controls";
import { SystemControls } from "@/components/menus/settings/system-controls";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSearchParamState, useSetSearchParamState } from "@/hooks/useSearchParamState";
import { ArrowLeftIcon } from "lucide-react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

type SettingsTabPath = "menus/controls" | "menus/history";

type BreadcrumbEntry = {
    id: string;
    label: string;
};

export default function Settings() {
    const { t } = useTranslation(["ui"]);
    const currentTab = useSearchParamState<string>("settings_tab");
    const setSettingsTab = useSetSearchParamState<string>("settings_tab");

    const normalizedTab: SettingsTabPath | undefined =
        currentTab === "menus/controls" || currentTab === "menus/history"
            ? (currentTab as SettingsTabPath)
            : undefined;

    const goBack = () => {
        setSettingsTab(undefined);
    };

    const breadcrumbs: BreadcrumbEntry[] = (() => {
        if (!normalizedTab) {
            return [{ id: "home", label: t("home") }];
        }

        const trail: BreadcrumbEntry[] = [{ id: "home", label: t("home") }];
        if (normalizedTab === "menus/controls" || normalizedTab === "menus/history") {
            trail.push({ id: "menus", label: t("menus") });
            trail.push({
                id: normalizedTab === "menus/controls" ? "menus-controls" : "menus-history",
                label: normalizedTab === "menus/controls" ? t("hotkeys_menu") : t("history"),
            });
        }
        return trail;
    })();

    const renderBreadcrumb = () => (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    const isHomeRootLink = crumb.id === "home" && normalizedTab;

                    return (
                        <Fragment key={crumb.id}>
                            <BreadcrumbItem>
                                {isHomeRootLink ? (
                                    <BreadcrumbLink
                                        render={
                                            <button
                                                type="button"
                                                onClick={() => setSettingsTab(undefined)}
                                            />
                                        }
                                    >
                                        {crumb.label}
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );

    if (normalizedTab === "menus/controls" || normalizedTab === "menus/history") {
        return (
            <>
                <div className="border-b px-4 py-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {renderBreadcrumb()}
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={goBack}>
                                <ArrowLeftIcon />
                                {t("back")}
                            </Button>
                        </div>
                    </div>
                </div>
                {normalizedTab === "menus/controls" ? (
                    <ControlsListSettingsPage />
                ) : (
                    <HistoryListSettingsPage />
                )}
            </>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <div className="border-b px-4 py-3">{renderBreadcrumb()}</div>
            <ScrollArea className="flex-1 min-h-0">
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

                            <Separator />

                            <div>
                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    {t("about")}
                                </h3>
                                <About />
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
