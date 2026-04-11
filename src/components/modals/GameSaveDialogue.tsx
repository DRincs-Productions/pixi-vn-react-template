import { type Theme, Typography } from "@mui/joy";
import { useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import ModalDialogCustom from "@/components/ModalDialog";
import GameSaveMenu from "@/components/menus/save-menu";
import { useSearchParamState, useSetSearchParamState } from "@/hooks/useSearchParamState";

export default function GameSaveDialogue() {
    const open = useSearchParamState<boolean>("saves");
    const setOpen = useSetSearchParamState<boolean>("saves");
    const { t } = useTranslation(["ui"]);
    const smScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));

    return (
        <ModalDialogCustom
            open={open ?? false}
            setOpen={setOpen}
            layout={smScreen ? "fullscreen" : "center"}
            head={<Typography level="h2">{`${t("save")}/${t("load")}`}</Typography>}
            minWidth="80%"
            sx={{
                minHeight: "50%",
                paddingBottom: 6,
            }}
        >
            <GameSaveMenu />
        </ModalDialogCustom>
    );
}
