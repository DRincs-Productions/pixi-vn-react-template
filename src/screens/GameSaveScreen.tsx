import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { AspectRatio, Grid, IconButton, Skeleton, Stack, Theme, Typography, useTheme } from "@mui/joy";
import { Pagination, Tooltip, useMediaQuery } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { openGameSaveScreenState } from '../atoms/openGameSaveScreenState';
import { saveLoadAlertState } from '../atoms/saveLoadAlertState';
import { saveScreenPageState } from '../atoms/saveScreenPageState';
import ModalDialogCustom from '../components/ModalDialog';
import TypographyShadow from "../components/TypographyShadow";
import GameSaveData from '../models/GameSaveData';
import { INTERFACE_DATA_USE_QUEY_KEY } from '../use_query/useQueryInterface';
import useQuerySaves from '../use_query/useQuerySaves';
import { useMyNavigate } from '../utilities/navigate-utility';
import { downloadGameSave, loadGameSaveFromFile } from '../utilities/save-utility';

export default function GameSaveScreen() {
    const [open, setOpen] = useRecoilState(openGameSaveScreenState);
    const { t } = useTranslation(["interface"]);
    const smScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
    const setOpenLoadAlert = useSetRecoilState(saveLoadAlertState);
    const [page, setPage] = useRecoilState(saveScreenPageState);
    const navigate = useMyNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient()
    let location = useLocation();

    return (
        <ModalDialogCustom
            open={open}
            setOpen={setOpen}
            layout={(smScreen ? "fullscreen" : "center")}
            head={<Typography level="h2">
                {`${t("save")}/${t("load")}`}
            </Typography>}
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
                    <IconButton
                        size="lg"
                        onClick={() => loadGameSaveFromFile(navigate, () => {
                            queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] })
                            enqueueSnackbar(t("success_load"), { variant: 'success' })
                            setOpen(false)
                        })}
                    >
                        <FolderOpenIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t("save_to_file")}>
                    <IconButton
                        size="lg"
                        onClick={() => { downloadGameSave() }}
                        disabled={location.pathname == "/"}
                    >
                        <DownloadIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
            </Stack>
            <Grid
                container
            >
                {/* for 6 element */}
                {Array.from({ length: 6 }).map((_, index) => {
                    let id = page * 6 + index;
                    return <Grid xs={12} sm={6} md={4} key={"ModalDialogCustom" + index}>
                        <GameSaveSlot
                            saveId={id}
                            onSave={() => {
                                setOpenLoadAlert({ open: true, data: id, type: "save", deafultName: "" });
                            }}
                            onOverwriteSave={(data) => {
                                setOpenLoadAlert({ open: true, data: id, type: "overwrite_save", deafultName: data.name });
                            }}
                            onLoad={(data) => {
                                setOpenLoadAlert({ open: true, data: { ...data, id: id }, type: "load" });
                            }}
                            onDelete={() => {
                                setOpenLoadAlert({ open: true, data: id, type: "delete" });
                            }}
                        />
                    </Grid>
                })}
            </Grid>
            <Pagination
                count={Infinity}
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
                    }
                }}
            />
        </ModalDialogCustom>
    );
}

function GameSaveSlot({ saveId, onDelete, onLoad, onOverwriteSave, onSave }: {
    saveId: number,
    onDelete: () => Promise<void> | void,
    onSave: () => Promise<void> | void,
    onOverwriteSave: (data: GameSaveData) => Promise<void> | void,
    onLoad: (saveData: GameSaveData) => Promise<void> | void,
}) {
    const { t } = useTranslation(["interface"]);
    const {
        isLoading,
        data: saveData,
        isError,
    } = useQuerySaves({ id: saveId })
    let location = useLocation();

    if (isLoading) {
        return (
            <AspectRatio
                sx={{
                    borderRadius: 10,
                    margin: { xs: 1, sm: 2, md: 1, lg: 2 },
                }}
            >
                <Skeleton />
            </AspectRatio>
        );
    }

    if (!saveData || isError) {
        return (
            <AspectRatio
                sx={{
                    borderRadius: 10,
                    margin: { xs: 1, sm: 2, md: 1, lg: 2 },
                }}
            >
                <IconButton
                    variant="soft"
                    sx={{
                        height: "100%",
                        width: "100%",
                    }}
                    onClick={onSave}
                    disabled={location.pathname == "/"}
                >
                    <SaveAsIcon sx={{ fontSize: '3rem', opacity: 0.2 }} />
                </IconButton>
            </AspectRatio>
        );
    }

    return (
        <AspectRatio
            objectFit="contain"
            sx={{
                borderRadius: 10,
                margin: { xs: 1, sm: 2, md: 1, lg: 2 },
            }}
        >
            <img
                src={saveData.image}
                style={{
                    backgroundColor: "#303030",
                    pointerEvents: "none",
                    userSelect: "none",
                }}
            />
            <Stack
                position={"absolute"}
                top={10}
                left={10}
                sx={{
                    pointerEvents: "none",
                    userSelect: "none",
                }}
            >
                <TypographyShadow
                    level="h2"
                >
                    {saveData.name}
                </TypographyShadow>
                <TypographyShadow>
                    {saveData.date.toLocaleDateString()}
                </TypographyShadow>
                <TypographyShadow>
                    {saveData.date.toLocaleTimeString()}
                </TypographyShadow>
                <TypographyShadow>
                    {`${t("save_slot")} ${saveId + 1}`}
                </TypographyShadow>
            </Stack>
            <Stack
                direction={"row"}
                position={"absolute"}
                bottom={10}
                right={10}
            >
                <IconButton
                    onClick={() => {
                        downloadGameSave(saveData)
                    }}
                >
                    <DownloadIcon
                        fontSize={"large"}
                        sx={{
                            color: useTheme().palette.neutral[300],
                        }}
                    />
                </IconButton>
                <IconButton
                    onClick={() => onOverwriteSave(saveData)}
                >
                    <SaveAsIcon
                        fontSize={"large"}
                        sx={{
                            color: useTheme().palette.neutral[300],
                        }}
                    />
                </IconButton>
                <IconButton
                    onClick={() => {
                        onLoad(saveData)
                    }}
                >
                    <UnarchiveIcon
                        fontSize={"large"}
                        sx={{
                            color: useTheme().palette.neutral[300],
                        }}
                    />
                </IconButton>
            </Stack>
            <Stack
                direction={"row"}
                position={"absolute"}
                top={10}
                right={10}
            >
                <IconButton
                    color="danger"
                    size="md"
                    onClick={onDelete}
                >
                    <DeleteIcon
                        fontSize={"large"}
                    />
                </IconButton>
            </Stack>
        </AspectRatio>
    );
}
