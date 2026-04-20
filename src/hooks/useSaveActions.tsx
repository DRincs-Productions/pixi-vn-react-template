import { SaveNameInput } from "@/components/menus/save-menu/save-forms";
import { useAlertDialog } from "@/components/providers/AlertDialogProvider";
import useGameProps from "@/hooks/useGameProps";
import { LAST_SAVE_USE_QUEY_KEY } from "@/hooks/useQueryLastSave";
import { SAVES_USE_QUEY_KEY } from "@/hooks/useQuerySaves";
import { useSetSearchParamState } from "@/hooks/useSearchParamState";
import type GameSaveData from "@/models/GameSaveData";
import { deleteSaveFromIndexDB, loadSave, saveGameToIndexDB } from "@/utils/save-utility";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function useSaveActions() {
    const setOpen = useSetSearchParamState<boolean>("saves");
    const { t } = useTranslation(["ui"]);
    const gameProps = useGameProps();
    const queryClient = useQueryClient();
    const { openAlertDialog } = useAlertDialog();
    const tempSaveNameRef = useRef<string>("");

    const handleLoad = useCallback(
        (data: GameSaveData & { id: number }) => {
            openAlertDialog({
                head: t("load"),
                content: t("you_sure_to_load_save", {
                    name: data.name || `${t("save_slot")} ${String(data.id + 1).padStart(2, "0")}`,
                }),
                onConfirm: () =>
                    loadSave(data)
                        .then(() => {
                            gameProps.invalidateInterfaceData();
                            toast.success(t("success_load"));
                            setOpen(undefined);
                            return true;
                        })
                        .catch((e) => {
                            toast.error(t("fail_load"));
                            console.error(e);
                            return false;
                        }),
            });
        },
        [openAlertDialog, t, gameProps, setOpen],
    );

    const handleDelete = useCallback(
        (id: number) => {
            openAlertDialog({
                head: t("delete"),
                content: t("you_sure_to_delete_save", {
                    name: `${t("save_slot")} ${String(id + 1).padStart(2, "0")}`,
                }),
                onConfirm: () =>
                    deleteSaveFromIndexDB(id)
                        .then(() => {
                            queryClient.setQueryData([SAVES_USE_QUEY_KEY, id], null);
                            queryClient.invalidateQueries({ queryKey: [LAST_SAVE_USE_QUEY_KEY] });
                            toast.success(t("success_delete"));
                            return true;
                        })
                        .catch((e) => {
                            toast.error(t("fail_delete"));
                            console.error(e);
                            return false;
                        }),
            });
        },
        [openAlertDialog, t, queryClient],
    );

    const handleSave = useCallback(
        (id: number) => {
            tempSaveNameRef.current = "";
            openAlertDialog({
                head: t("save"),
                content: (
                    <SaveNameInput
                        initialValue=""
                        onValueChange={(v) => {
                            tempSaveNameRef.current = v;
                        }}
                    />
                ),
                onConfirm: () => {
                    const savePromise = saveGameToIndexDB({
                        id,
                        name: tempSaveNameRef.current,
                    }).then((save) => {
                        queryClient.setQueryData([SAVES_USE_QUEY_KEY, save.id], save);
                        queryClient.setQueryData([LAST_SAVE_USE_QUEY_KEY], save);
                    });
                    toast.promise(savePromise, {
                        loading: t("saving"),
                        success: t("success_save"),
                        error: t("fail_save"),
                    });
                    return savePromise
                        .then(() => true)
                        .catch((e) => {
                            console.error(e);
                            return false;
                        });
                },
            });
        },
        [openAlertDialog, t, queryClient],
    );

    const handleOverwriteSave = useCallback(
        (id: number, existingName: string) => {
            tempSaveNameRef.current = existingName;
            openAlertDialog({
                head: t("overwrite_save"),
                content: (
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-destructive">
                            {t("you_sure_to_overwrite_save")}
                        </p>
                        <SaveNameInput
                            initialValue={existingName}
                            onValueChange={(v) => {
                                tempSaveNameRef.current = v;
                            }}
                        />
                    </div>
                ),
                onConfirm: () => {
                    const savePromise = saveGameToIndexDB({
                        id,
                        name: tempSaveNameRef.current,
                    }).then((save) => {
                        queryClient.setQueryData([SAVES_USE_QUEY_KEY, save.id], save);
                        queryClient.setQueryData([LAST_SAVE_USE_QUEY_KEY], save);
                    });
                    toast.promise(savePromise, {
                        loading: t("saving"),
                        success: t("success_save"),
                        error: t("fail_save"),
                    });
                    return savePromise
                        .then(() => true)
                        .catch((e) => {
                            console.error(e);
                            return false;
                        });
                },
            });
        },
        [openAlertDialog, t, queryClient],
    );

    return {
        handleLoad,
        handleDelete,
        handleSave,
        handleOverwriteSave,
    };
}
