import ModalDialogCustom from "@/components/ModalDialog";
import SettingButton from "@/components/SettingButton";
import { Separator } from "@/components/ui/separator";
import { useSetSearchParamState } from "@/hooks/useSearchParamState";
import { Game } from "@drincs/pixi-vn";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HistoryIcon from "@mui/icons-material/History";
import SaveIcon from "@mui/icons-material/Save";
import { Button, Stack, Typography } from "@mui/joy";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function QuickMenus() {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <OpenHistorySettingButton />
                <SaveLoadMenuButton />
            </div>
            <Separator className="my-4" />
            <ReturnMainMenuButton />
        </div>
    );
}

export default function ReturnMainMenuButton() {
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const { t } = useTranslation(["ui"]);

    const location = useLocation();
    if (location.pathname === "/") {
        return null;
    }

    return (
        <>
            <Stack direction="row" justifyContent="space-between" useFlexGap spacing={1}>
                <Button
                    variant="outlined"
                    color="danger"
                    startDecorator={<ExitToAppIcon />}
                    onClick={() => setOpenDialog(true)}
                >
                    {t("return_main_menu")}
                </Button>
            </Stack>
            <ModalDialogCustom
                open={openDialog}
                setOpen={setOpenDialog}
                color="danger"
                head={
                    <Typography level="h4" startDecorator={<ExitToAppIcon />}>
                        {t("attention")}
                    </Typography>
                }
                actions={
                    <>
                        <Button
                            key={"exit"}
                            color="danger"
                            variant="outlined"
                            onClick={() => {
                                Game.clear();
                                navigate({ to: "/" });
                                setOpenDialog(false);
                            }}
                            startDecorator={<ExitToAppIcon />}
                        >
                            {t("exit")}
                        </Button>
                        <Button
                            key={"cancel"}
                            color="neutral"
                            variant="plain"
                            onClick={() => setOpenDialog(false)}
                        >
                            {t("cancel")}
                        </Button>
                    </>
                }
            >
                <Typography>{t("you_sure_to_return_main_menu")}</Typography>
            </ModalDialogCustom>
        </>
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
        <SettingButton
            onClick={() => {
                setSettings(undefined);
                setHistory(true);
            }}
        >
            <HistoryIcon />
            <Typography level="title-md">{t("history")}</Typography>
            <Typography
                sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                }}
                level="body-md"
            >
                Ctrl+H
            </Typography>
        </SettingButton>
    );
}

export function SaveLoadMenuButton() {
    const { t } = useTranslation(["ui"]);
    const setSaves = useSetSearchParamState<boolean>("saves");

    return (
        <SettingButton
            key={"save_load_button"}
            onClick={() => {
                setSaves(true);
            }}
        >
            <SaveIcon />
            <Typography level="title-md">{t(`${t("save")}/${t("load")}`)}</Typography>
        </SettingButton>
    );
}
