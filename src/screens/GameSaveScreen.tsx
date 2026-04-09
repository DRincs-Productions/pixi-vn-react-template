import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DownloadIcon from "@mui/icons-material/Download";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { Grid, IconButton, Input, Stack, type Theme, Typography } from "@mui/joy";
import { Pagination, Tooltip, useMediaQuery } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useSearch } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useSnackbar } from "notistack";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { FileRouteTypes } from "@/routeTree.gen";
import GameSaveSlot from "../components/GameSaveSlot";
import ModalDialogCustom from "../components/ModalDialog";
import useGameProps from "../hooks/useGameProps";
import { LAST_SAVE_USE_QUEY_KEY } from "../hooks/useQueryLastSave";
import { SAVES_USE_QUEY_KEY } from "../hooks/useQuerySaves";
import type GameSaveData from "../models/GameSaveData";
import { useConfirmDialog } from "../providers/ConfirmDialogProvider";
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
    const { saves: open = false } = useSearch({ from: "__root__" });
    const navigate = useNavigate();
    const page = useStore(GameSaveScreenStore.store, (state) => state.page);
    const { t } = useTranslation(["ui"]);
    const smScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
    const { enqueueSnackbar } = useSnackbar();
    const gameProps = useGameProps();
    const location = useLocation();
    const queryClient = useQueryClient();
    const { openConfirmDialog } = useConfirmDialog();
    const tempSaveNameRef = useRef<string>("");

    const setOpen = useCallback(
        (value: boolean) => navigate({ search: ((prev: any) => ({ ...prev, saves: value })) as any }),
        [navigate],
    );

    const handleLoad = useCallback(
        (data: GameSaveData & { id: number }) => {
            openConfirmDialog({
                head: (
                    <Typography level="h4" startDecorator={<CloudDownloadIcon />}>
                        {t("load")}
                    </Typography>
                ),
                content: (
                    <Typography>
                        {t("you_sure_to_load_save", {
                            name: data.name || `${t("save_slot")} ${data.id}`,
                        })}
                    </Typography>
                ),
                onConfirm: () =>
                    loadSave(data, (to) => navigate({ to }))
                        .then(() => {
                            gameProps.invalidateInterfaceData();
                            enqueueSnackbar(t("success_load"), { variant: "success" });
                            navigate({ search: ((prev: any) => ({ ...prev, saves: undefined })) as any });
                            return true;
                        })
                        .catch((e) => {
                            enqueueSnackbar(t("fail_load"), { variant: "error" });
                            console.error(e);
                            return false;
                        }),
            });
        },
        [openConfirmDialog, t, navigate, gameProps, enqueueSnackbar],
    );

    const handleDelete = useCallback(
        (id: number) => {
            openConfirmDialog({
                head: (
                    <Typography level="h4" startDecorator={<CloudDownloadIcon />}>
                        {t("delete")}
                    </Typography>
                ),
                content: <Typography>{t("you_sure_to_delete_save", { name: `${t("save_slot")} ${id}` })}</Typography>,
                onConfirm: () =>
                    deleteSaveFromIndexDB(id)
                        .then(() => {
                            queryClient.setQueryData([SAVES_USE_QUEY_KEY, id], null);
                            queryClient.invalidateQueries({ queryKey: [LAST_SAVE_USE_QUEY_KEY] });
                            enqueueSnackbar(t("success_delete"), { variant: "success" });
                            return true;
                        })
                        .catch((e) => {
                            enqueueSnackbar(t("fail_delete"), { variant: "error" });
                            console.error(e);
                            return false;
                        }),
            });
        },
        [openConfirmDialog, t, queryClient, enqueueSnackbar],
    );

    const handleSave = useCallback(
        (id: number, defaultName?: string) => {
            tempSaveNameRef.current = defaultName || "";
            openConfirmDialog({
                head: (
                    <Typography level="h4" startDecorator={<CloudDownloadIcon />}>
                        {t("save")}
                    </Typography>
                ),
                content: (
                    <>
                        <Typography>{t("save_as")}</Typography>
                        <SaveNameInput
                            initialValue={defaultName || ""}
                            onValueChange={(v) => {
                                tempSaveNameRef.current = v;
                            }}
                        />
                    </>
                ),
                onConfirm: () =>
                    saveGameToIndexDB({ id, name: tempSaveNameRef.current })
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
                        }),
            });
        },
        [openConfirmDialog, t, queryClient, enqueueSnackbar],
    );

    return (
        <ModalDialogCustom
            open={open}
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
                                            enqueueSnackbar(t("allert_error_occurred"), { variant: "error" });
                                            return;
                                        }
                                        gameProps.invalidateInterfaceData();
                                        enqueueSnackbar(t("success_load"), { variant: "success" });
                                        setOpen(false);
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
