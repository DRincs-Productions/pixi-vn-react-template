import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import { AspectRatio, IconButton, Skeleton, Stack, useTheme } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import TypographyShadow from "../components/TypographyShadow";
import { MAIN_MENU_ROUTE } from "../constans";
import useQuerySaves from "../hooks/useQuerySaves";
import GameSaveData from "../models/GameSaveData";
import { downloadGameSave } from "../utils/save-utility";

export default function GameSaveSlot({
    saveId,
    onDelete,
    onLoad,
    onOverwriteSave,
    onSave,
}: {
    saveId: number;
    onDelete: () => Promise<void> | void;
    onSave: () => Promise<void> | void;
    onOverwriteSave: (data: GameSaveData) => Promise<void> | void;
    onLoad: (saveData: GameSaveData) => Promise<void> | void;
}) {
    const { t } = useTranslation(["ui"]);
    const { isLoading, data: saveData, isError } = useQuerySaves({ id: saveId });
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
                    variant='soft'
                    sx={{
                        height: "100%",
                        width: "100%",
                    }}
                    onClick={onSave}
                    disabled={location.pathname == MAIN_MENU_ROUTE}
                >
                    <SaveAsIcon sx={{ fontSize: "3rem", opacity: 0.2 }} />
                </IconButton>
            </AspectRatio>
        );
    }

    return (
        <AspectRatio
            objectFit='contain'
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
                <TypographyShadow level='h2'>{saveData.name}</TypographyShadow>
                <TypographyShadow>{saveData.date.toLocaleDateString()}</TypographyShadow>
                <TypographyShadow>{saveData.date.toLocaleTimeString()}</TypographyShadow>
                <TypographyShadow>{`${t("save_slot")} ${saveId + 1}`}</TypographyShadow>
            </Stack>
            <Stack direction={"row"} position={"absolute"} bottom={10} right={10}>
                <IconButton
                    onClick={() => {
                        downloadGameSave(saveData);
                    }}
                >
                    <DownloadIcon
                        fontSize={"large"}
                        sx={{
                            color: useTheme().palette.neutral[300],
                        }}
                    />
                </IconButton>
                {location.pathname !== MAIN_MENU_ROUTE && (
                    <IconButton onClick={() => onOverwriteSave(saveData)}>
                        <SaveAsIcon
                            fontSize={"large"}
                            sx={{
                                color: useTheme().palette.neutral[300],
                            }}
                        />
                    </IconButton>
                )}
                <IconButton
                    onClick={() => {
                        onLoad(saveData);
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
            <Stack direction={"row"} position={"absolute"} top={10} right={10}>
                <IconButton color='danger' size='md' onClick={onDelete}>
                    <DeleteIcon fontSize={"large"} />
                </IconButton>
            </Stack>
        </AspectRatio>
    );
}
