import DownloadIcon from "@mui/icons-material/Download";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { Grid, IconButton, Stack, Theme, Typography } from "@mui/joy";
import { Pagination, Tooltip, useMediaQuery } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import GameSaveSlot from "../components/GameSaveSlot";
import ModalDialogCustom from "../components/ModalDialog";
import { MAIN_MENU_ROUTE } from "../constans";
import useMyNavigate from "../hooks/useMyNavigate";
import useGameSaveScreenStore from "../stores/useGameSaveScreenStore";
import { INTERFACE_DATA_USE_QUEY_KEY } from "../use_query/useQueryInterface";
import { downloadGameSave, loadGameSaveFromFile } from "../utils/save-utility";

export default function GameSaveScreen() {
    const {
        setOpen,
        open,
        page,
        setPage,
        editDeleteAlert: openDeleteAlert,
        editLoadAlert: openLoadAlert,
        editOverwriteSaveAlert: openOverwriteSaveAlert,
        editSaveAlert: openSaveAlert,
    } = useGameSaveScreenStore(useShallow((state) => state));
    const { t } = useTranslation(["ui"]);
    const smScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
    const navigate = useMyNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    let location = useLocation();

    return (
        <ModalDialogCustom
            open={open}
            setOpen={setOpen}
            layout={smScreen ? "fullscreen" : "center"}
            head={<Typography level='h2'>{`${t("save")}/${t("load")}`}</Typography>}
            minWidth='80%'
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
                            size='lg'
                            onClick={() =>
                                loadGameSaveFromFile(navigate, () => {
                                    queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] });
                                    enqueueSnackbar(t("success_load"), { variant: "success" });
                                    setOpen(false);
                                })
                            }
                        >
                            <FolderOpenIcon fontSize='large' />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title={t("save_to_file")}>
                    <span>
                        <IconButton
                            size='lg'
                            onClick={() => {
                                downloadGameSave();
                            }}
                            disabled={location.pathname == MAIN_MENU_ROUTE}
                        >
                            <DownloadIcon fontSize='large' />
                        </IconButton>
                    </span>
                </Tooltip>
            </Stack>
            <Grid container>
                {/* for 6 element */}
                {Array.from({ length: 6 }).map((_, index) => {
                    let id = page * 6 + index;
                    return (
                        <Grid xs={12} sm={6} md={4} key={"ModalDialogCustom" + index}>
                            <GameSaveSlot
                                saveId={id}
                                onSave={() => {
                                    openSaveAlert(id);
                                }}
                                onOverwriteSave={(data) => {
                                    openOverwriteSaveAlert(id, data.name);
                                }}
                                onLoad={(data) => {
                                    openLoadAlert({ ...data, id: id });
                                }}
                                onDelete={() => {
                                    openDeleteAlert(id);
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
                onChange={(_event, value) => setPage(value - 1)}
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
