import DownloadIcon from "@mui/icons-material/Download";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SaveIcon from "@mui/icons-material/Save";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { Typography } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import SettingButton from "../../components/SettingButton";
import useGameProps from "../../hooks/useGameProps";
import useQueryLastSave, { LAST_SAVE_USE_QUEY_KEY } from "../../hooks/useQueryLastSave";
import { SAVES_USE_QUEY_KEY } from "../../hooks/useQuerySaves";
import useGameSaveScreenStore from "../../stores/useGameSaveScreenStore";
import useSettingsScreenStore from "../../stores/useSettingsScreenStore";
import { downloadGameSave, loadGameSaveFromFile, saveGameToIndexDB } from "../../utils/save-utility";

export default function SaveLoadSettingButtons() {
    const navigate = useNavigate();
    const { t } = useTranslation(["ui"]);
    const openLoadAlert = useGameSaveScreenStore((state) => state.editLoadAlert);
    const editOpenSaveScreen = useGameSaveScreenStore((state) => state.editOpen);
    const setOpenSettings = useSettingsScreenStore((state) => state.setOpen);
    const queryClient = useQueryClient();
    const gameProps = useGameProps();
    const { enqueueSnackbar } = useSnackbar();
    const { data: lastSave = null } = useQueryLastSave();
    const location = useLocation();

    return [
        location.pathname === "/" ? null : (
            <SettingButton
                key={"quick_save_button"}
                onClick={() => {
                    saveGameToIndexDB()
                        .then((save) => {
                            queryClient.setQueryData([SAVES_USE_QUEY_KEY, save.id], save);
                            queryClient.setQueryData([LAST_SAVE_USE_QUEY_KEY], save);
                            enqueueSnackbar(t("success_save"), { variant: "success" });
                        })
                        .catch(() => {
                            enqueueSnackbar(t("fail_save"), { variant: "error" });
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
                    Alt+S
                </Typography>
            </SettingButton>
        ),
        <SettingButton
            key={"load_last_save_button"}
            onClick={() => {
                lastSave && openLoadAlert(lastSave);
                setOpenSettings(false);
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
                Alt+L
            </Typography>
        </SettingButton>,
        <SettingButton
            key={"save_load_button"}
            onClick={() => {
                editOpenSaveScreen();
                setOpenSettings(false);
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
                            enqueueSnackbar(t("allert_error_occurred"), { variant: "error" });
                            return;
                        }
                        gameProps.invalidateInterfaceData();
                        enqueueSnackbar(t("success_load"), { variant: "success" });
                        setOpenSettings(false);
                    },
                )
            }
        >
            <FolderOpenIcon />
            <Typography level="title-md">{t("load_from_file")}</Typography>
        </SettingButton>,
    ];
}
