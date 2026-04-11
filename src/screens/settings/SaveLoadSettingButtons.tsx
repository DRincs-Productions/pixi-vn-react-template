import DownloadIcon from "@mui/icons-material/Download";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SaveIcon from "@mui/icons-material/Save";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { Typography } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import SettingButton from "../../components/SettingButton";
import useGameProps from "../../hooks/useGameProps";
import useQueryLastSave, { LAST_SAVE_USE_QUEY_KEY } from "../../hooks/useQueryLastSave";
import { SAVES_USE_QUEY_KEY } from "../../hooks/useQuerySaves";
import { useSetSearchParamState } from "../../hooks/useSearchParamState";
import { useAlertDialog } from "../../providers/AlertDialogProvider";
import { downloadGameSave, loadGameSaveFromFile, loadSave, saveGameToIndexDB } from "../../utils/save-utility";

export default function SaveLoadSettingButtons() {
    const navigate = useNavigate();
    const { t } = useTranslation(["ui"]);
    const queryClient = useQueryClient();
    const gameProps = useGameProps();
    const { data: lastSave = null } = useQueryLastSave();
    const location = useLocation();
    const { openAlertDialog } = useAlertDialog();
    const setSaves = useSetSearchParamState<boolean>("saves");

    return [
        location.pathname === "/" ? null : (
            <SettingButton
                key={"quick_save_button"}
                onClick={() => {
                    const savePromise = saveGameToIndexDB().then((save) => {
                        queryClient.setQueryData([SAVES_USE_QUEY_KEY, save.id], save);
                        queryClient.setQueryData([LAST_SAVE_USE_QUEY_KEY], save);
                    });
                    toast.promise(savePromise, {
                        loading: t("saving"),
                        success: t("success_save"),
                        error: t("fail_save"),
                    });
                }}
                disabled={location.pathname === "/"}
            >
                <SaveAsIcon />
                <Typography level="title-md">{t("quick_save")}</Typography>
                <Typography
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                    }}
                    level="body-md"
                >
                    Ctrl+S
                </Typography>
            </SettingButton>
        ),
        <SettingButton
            key={"load_last_save_button"}
            onClick={() => {
                if (!lastSave) return;
                openAlertDialog({
                    head: t("load"),
                    content: t("you_sure_to_load_save", {
                        name: lastSave.name || `${t("save_slot")} ${lastSave.id}`,
                    }),
                    onConfirm: () =>
                        loadSave(lastSave, (to) => navigate({ to }))
                            .then(() => {
                                gameProps.invalidateInterfaceData();
                                toast.success(t("success_load"));
                                return true;
                            })
                            .catch((e) => {
                                toast.error(t("fail_load"));
                                console.error(e);
                                return false;
                            }),
                });
            }}
            disabled={!lastSave}
        >
            <FileUploadIcon />
            <Typography level="title-md">{t("load_last_save")}</Typography>
            <Typography
                sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                }}
                level="body-md"
            >
                Ctrl+L
            </Typography>
        </SettingButton>,
        <SettingButton
            key={"save_load_button"}
            onClick={() => {
                setSaves(true);
            }}
        >
            <SaveIcon />
            <Typography level="title-md">{t(`${t("save")}/${t("load")}`)}</Typography>
        </SettingButton>,
        location.pathname === "/" ? null : (
            <SettingButton key={"save_to_file"} onClick={() => downloadGameSave()} disabled={location.pathname === "/"}>
                <DownloadIcon />
                <Typography level="title-md">{t("save_to_file")}</Typography>
            </SettingButton>
        ),
        <SettingButton
            key={"load_button"}
            onClick={() =>
                loadGameSaveFromFile(
                    (to) => navigate({ to }),
                    (err) => {
                        if (err) {
                            toast.error(t("allert_error_occurred"));
                            return;
                        }
                        gameProps.invalidateInterfaceData();
                        toast.success(t("success_load"));
                    },
                )
            }
        >
            <FolderOpenIcon />
            <Typography level="title-md">{t("load_from_file")}</Typography>
        </SettingButton>,
    ];
}
