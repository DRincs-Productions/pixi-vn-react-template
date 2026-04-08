import DownloadIcon from "@mui/icons-material/Download";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { Grid, IconButton, Stack, type Theme, Typography } from "@mui/joy";
import { Pagination, Tooltip, useMediaQuery } from "@mui/material";
import { useStore } from "@tanstack/react-store";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import type { FileRouteTypes } from "@/routeTree.gen";
import GameSaveSlot from "../components/GameSaveSlot";
import ModalDialogCustom from "../components/ModalDialog";
import useGameProps from "../hooks/useGameProps";
import {
    editDeleteAlert,
    editLoadAlert,
    editOverwriteSaveAlert,
    editSaveAlert,
    gameSaveScreenStore,
    setGameSaveScreenOpen,
    setGameSaveScreenPage,
} from "../stores/useGameSaveScreenStore";
import { downloadGameSave, loadGameSaveFromFile } from "../utils/save-utility";

export default function GameSaveScreen() {
    const open = useStore(gameSaveScreenStore, (state) => state.open);
    const page = useStore(gameSaveScreenStore, (state) => state.page);
    const { t } = useTranslation(["ui"]);
    const smScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const gameProps = useGameProps();
    const location = useLocation();

    return (
        <ModalDialogCustom
            open={open}
            setOpen={setGameSaveScreenOpen}
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
                                        setGameSaveScreenOpen(false);
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
                        <Grid xs={12} sm={6} md={4} key={"ModalDialogCustom" + index}>
                            <GameSaveSlot
                                saveId={id}
                                onSave={() => {
                                    editSaveAlert(id);
                                }}
                                onOverwriteSave={(data) => {
                                    editOverwriteSaveAlert(id, data.name);
                                }}
                                onLoad={(data) => {
                                    editLoadAlert({ ...data, id: id });
                                }}
                                onDelete={() => {
                                    editDeleteAlert(id);
                                }}
                            />
                        </Grid>
                    );
                })}
            </Grid>
            <Pagination
                count={999}
                siblingCount={smScreen ? 2 : 7}
                page={page + 1}
                onChange={(_event, value) => setGameSaveScreenPage(value - 1)}
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
