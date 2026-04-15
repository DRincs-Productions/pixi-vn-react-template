import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { useSetSearchParamState } from "@/hooks/useSearchParamState";
import { Game } from "@drincs/pixi-vn";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { HistoryIcon, LogOutIcon, SaveIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export function QuickMenus() {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <OpenHistorySettingButton />
                <SaveLoadMenuButton />
            </div>
            <Separator />
            <ReturnMainMenuButton />
        </div>
    );
}

export default function ReturnMainMenuButton() {
    const navigate = useNavigate();
    const { t } = useTranslation(["ui"]);
    const location = useLocation();

    if (location.pathname === "/") {
        return null;
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger
                render={
                    <Button variant="destructive">
                        <LogOutIcon />
                        {t("return_main_menu")}
                    </Button>
                }
            />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("attention")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("you_sure_to_return_main_menu")}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={() => {
                            Game.clear();
                            navigate({ to: "/" });
                        }}
                    >
                        <LogOutIcon />
                        {t("exit")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function OpenHistorySettingButton() {
    const { t } = useTranslation(["ui"]);
    const location = useLocation();
    const setSettings = useSetSearchParamState<boolean>("settings");
    const setHistory = useSetSearchParamState<boolean>("history");

    if (!location.pathname.startsWith("/game")) {
        return null;
    }

    return (
        <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
                setSettings(undefined);
                setHistory(true);
            }}
        >
            <HistoryIcon />
            {t("history")}
            <KbdGroup className="ml-auto">
                <Kbd>Ctrl</Kbd>
                <Kbd>H</Kbd>
            </KbdGroup>
        </Button>
    );
}

export function SaveLoadMenuButton() {
    const { t } = useTranslation(["ui"]);
    const setSaves = useSetSearchParamState<boolean>("saves");

    return (
        <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
                setSaves(true);
            }}
        >
            <SaveIcon />
            {t(`${t("save")}/${t("load")}`)}
        </Button>
    );
}
