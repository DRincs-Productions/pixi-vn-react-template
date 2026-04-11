import DownloadIcon from "@mui/icons-material/Download";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { Grid, IconButton, Input, Stack, type Theme, Typography } from "@mui/joy";
import { Pagination, Tooltip, useMediaQuery } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { FileRouteTypes } from "@/routeTree.gen";
import GameSaveSlot from "../components/GameSaveSlot";
import ModalDialogCustom from "../components/ModalDialog";
import { useAlertDialog } from "../components/providers/AlertDialogProvider";
import useGameProps from "../hooks/useGameProps";
import { LAST_SAVE_USE_QUEY_KEY } from "../hooks/useQueryLastSave";
import { SAVES_USE_QUEY_KEY } from "../hooks/useQuerySaves";
import { useSearchParamState, useSetSearchParamState } from "../hooks/useSearchParamState";
import type GameSaveData from "../models/GameSaveData";
import { GameSaveScreenStore } from "../stores/useGameSaveScreenStore";
import {
    deleteSaveFromIndexDB,
    downloadGameSave,
    loadGameSaveFromFile,
    loadSave,
    saveGameToIndexDB,
} from "../utils/save-utility";

function SaveNameInput({
    initialValue,
    onValueChange,
}: {
    initialValue: string;
    onValueChange: (value: string) => void;
}) {
    const [value, setValue] = useState(initialValue);
    return (
        <Input
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
                onValueChange(e.target.value);
            }}
        />
    );
}

export default function GameSaveScreen() {
    const open = useSearchParamState<boolean>("saves");
    const setOpen = useSetSearchParamState<boolean>("saves");
    const navigate = useNavigate();
    const page = useStore(GameSaveScreenStore.store, (state) => state.page);
    const { t } = useTranslation(["ui"]);
    const smScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
    const gameProps = useGameProps();
    const location = useLocation();
    const queryClient = useQueryClient();
    const { openAlertDialog } = useAlertDialog();
    const tempSaveNameRef = useRef<string>("");

    const handleLoad = useCallback(
        (data: GameSaveData & { id: number }) => {
            openAlertDialog({
                head: t("load"),
                content: t("you_sure_to_load_save", {
                    name: data.name || `${t("save_slot")} ${data.id}`,
                }),
                onConfirm: () =>
                    loadSave(data, (to) => navigate({ to }))
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
        [openAlertDialog, t, navigate, gameProps, setOpen],
    );

    const handleDelete = useCallback(
        (id: number) => {
            openAlertDialog({
                head: t("delete"),
                content: t("you_sure_to_delete_save", { name: `${t("save_slot")} ${id}` }),
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
        (id: number, defaultName?: string) => {
            tempSaveNameRef.current = defaultName || "";
            openAlertDialog({
                head: t("save"),
                content: (
                    <>
                        {t("save_as")}
                        <SaveNameInput
                            initialValue={defaultName || ""}
                            onValueChange={(v) => {
                                tempSaveNameRef.current = v;
                            }}
                        />
                    </>
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
            <Stack
                direction={"row"}
                sx={{
                    position: "absolute",
                    top: 10,
                    right: 40,
                }}
            >
                <Tooltip title={t("load_from_file")}>
                    <span>
                        <IconButton
                            size="lg"
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
                                        setOpen(undefined);
                                    },
                                )
                            }
                        >
                            <FolderOpenIcon fontSize="large" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title={t("save_to_file")}>
                    <span>
                        <IconButton
                            size="lg"
                            onClick={() => {
                                downloadGameSave();
                            }}
                            disabled={(location.pathname as FileRouteTypes["fullPaths"]) === "/"}
                        >
                            <DownloadIcon fontSize="large" />
                        </IconButton>
                    </span>
                </Tooltip>
            </Stack>
            <Grid container>
                {/* for 6 element */}
                {Array.from({ length: 6 }).map((_, index) => {
                    const id = page * 6 + index;
                    return (
                        <Grid xs={12} sm={6} md={4} key={`ModalDialogCustom${id}`}>
                            <GameSaveSlot
                                saveId={id}
                                onSave={() => handleSave(id)}
                                onOverwriteSave={(data) => handleSave(id, data.name)}
                                onLoad={(data) => handleLoad({ ...data, id })}
                                onDelete={() => handleDelete(id)}
                            />
                        </Grid>
                    );
                })}
            </Grid>
            <Pagination
                count={999}
                siblingCount={smScreen ? 2 : 7}
                page={page + 1}
                onChange={(_event, value) => GameSaveScreenStore.setPage(value - 1)}
                sx={{
                    position: "absolute",
                    bottom: 7,
                    right: 0,
                    left: 0,
                    justifySelf: "center",
                    "& .MuiPaginationItem-root": {
                        color: "var(--joy-palette-text-primary)",
                    },
                }}
            />
        </ModalDialogCustom>
    );
}
