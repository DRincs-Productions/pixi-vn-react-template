import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { Input, Typography } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ModalConfirmation from "../../components/ModalConfirmation";
import useMyNavigate from "../../hooks/useMyNavigate";
import { INTERFACE_DATA_USE_QUEY_KEY } from "../../hooks/useQueryInterface";
import { LAST_SAVE_USE_QUEY_KEY } from "../../hooks/useQueryLastSave";
import { SAVES_USE_QUEY_KEY } from "../../hooks/useQuerySaves";
import useGameSaveScreenStore from "../../stores/useGameSaveScreenStore";
import { deleteSaveFromIndexDB, loadSave, saveGameToIndexDB } from "../../utils/save-utility";

export default function SaveLoadAlert() {
    const navigate = useMyNavigate();
    const alertData = useGameSaveScreenStore((state) => state.alert);
    const close = useGameSaveScreenStore((state) => state.closeAlert);
    const { t } = useTranslation(["ui"]);
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const [tempSaveName, setTempSaveName] = useState<string>("");
    const setOpenSaveScreen = useGameSaveScreenStore((state) => state.setOpen);

    useEffect(() => {
        if (alertData.open && (alertData.type == "save" || alertData.type == "overwrite_save")) {
            setTempSaveName(alertData.deafultName || "");
        }
    }, [alertData]);

    return (
        <ModalConfirmation
            open={alertData.open}
            setOpen={close}
            color='primary'
            head={
                <Typography level='h4' startDecorator={<CloudDownloadIcon />}>
                    {alertData.type == "load" && t("load")}
                    {alertData.type == "delete" && t("delete")}
                    {(alertData.type == "save" || alertData.type == "overwrite_save") && t("save")}
                </Typography>
            }
            onConfirm={() => {
                if (!alertData.open) {
                    return false;
                }
                switch (alertData.type) {
                    case "load":
                        return loadSave(alertData.data, navigate)
                            .then(() => {
                                queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] });
                                enqueueSnackbar(t("success_load"), { variant: "success" });
                                setOpenSaveScreen(false);
                                return true;
                            })
                            .catch((e) => {
                                enqueueSnackbar(t("fail_load"), { variant: "error" });
                                console.error(e);
                                return false;
                            });
                    case "delete":
                        return deleteSaveFromIndexDB(alertData.data)
                            .then(() => {
                                queryClient.setQueryData([SAVES_USE_QUEY_KEY, alertData.data], null);
                                queryClient.invalidateQueries({ queryKey: [LAST_SAVE_USE_QUEY_KEY] });
                                enqueueSnackbar(t("success_delete"), { variant: "success" });
                                return true;
                            })
                            .catch((e) => {
                                enqueueSnackbar(t("fail_delete"), { variant: "error" });
                                console.error(e);
                                return false;
                            });
                    case "save":
                    case "overwrite_save":
                        return saveGameToIndexDB({ id: alertData.data, name: tempSaveName })
                            .then((save) => {
                                queryClient.setQueryData([SAVES_USE_QUEY_KEY, save.id], save);
                                queryClient.setQueryData([LAST_SAVE_USE_QUEY_KEY], save);
                                enqueueSnackbar(t("success_save"), { variant: "success" });
                                return true;
                            })
                            .catch((e) => {
                                enqueueSnackbar(t("fail_save"), { variant: "error" });
                                console.error(e);
                                return false;
                            });
                }
            }}
        >
            <Typography>
                {alertData.type == "load" &&
                    t("you_sure_to_load_save", {
                        name: alertData.data.name || `${t("save_slot")} ${alertData.data.id}`,
                    })}
                {alertData.type == "delete" &&
                    t("you_sure_to_delete_save", { name: `${t("save_slot")} ${alertData.data}` })}
                {(alertData.type == "save" || alertData.type == "overwrite_save") && t("save_as")}
            </Typography>
            {(alertData.type == "save" || alertData.type == "overwrite_save") && (
                <Input value={tempSaveName} onChange={(e) => setTempSaveName(e.target.value)} />
            )}
        </ModalConfirmation>
    );
}
