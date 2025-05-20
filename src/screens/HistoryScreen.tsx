import CheckIcon from "@mui/icons-material/Check";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Box, Chip, Input, Stack, Theme, Typography } from "@mui/joy";
import Avatar from "@mui/joy/Avatar";
import { useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import ModalDialogCustom from "../components/ModalDialog";
import useEventListener from "../hooks/useKeyDetector";
import useHistoryScreenStore from "../stores/useHistoryScreenStore";
import { useQueryNarrativeHistory } from "../use_query/useQueryInterface";

function HistoryList({ searchString }: { searchString?: string }) {
    const { data = [] } = useQueryNarrativeHistory({ searchString });

    return (
        <Stack spacing={2} justifyContent='flex-end'>
            {data.map((data, index) => {
                return (
                    <React.Fragment key={"history" + index}>
                        <Stack direction='row' spacing={1.5}>
                            <Avatar size='sm' src={data.icon} />
                            <Box sx={{ flex: 1 }}>
                                {data.character && <Typography level='title-sm'>{data.character}</Typography>}
                                <Markdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    components={{
                                        p: ({ children, id }) => {
                                            return (
                                                <p key={id} style={{ margin: 0 }}>
                                                    {children}
                                                </p>
                                            );
                                        },
                                    }}
                                >
                                    {data.text}
                                </Markdown>
                            </Box>
                        </Stack>
                        <Stack direction='row' spacing={0.5}>
                            <Box sx={{ flex: 1 }}>
                                {data.choices &&
                                    data.choices.map((choice, index) => {
                                        if (choice.hidden) {
                                            return null;
                                        }
                                        if (choice.isResponse) {
                                            return (
                                                <Chip
                                                    key={"choices-success" + index}
                                                    color='success'
                                                    endDecorator={<CheckIcon />}
                                                >
                                                    {choice.text}
                                                </Chip>
                                            );
                                        }
                                        return (
                                            <Chip key={"choices" + index} color='primary'>
                                                {choice.text}
                                            </Chip>
                                        );
                                    })}
                                {data.inputValue && (
                                    <Chip key={"choices-success" + index} color='neutral'>
                                        {data.inputValue.toString()}
                                    </Chip>
                                )}
                            </Box>
                        </Stack>
                    </React.Fragment>
                );
            })}
        </Stack>
    );
}

export default function HistoryScreen() {
    const open = useHistoryScreenStore((state) => state.open);
    const editOpen = useHistoryScreenStore((state) => state.editOpen);
    const [searchString, setSearchString] = useState("");
    const { t } = useTranslation(["ui"]);
    const smScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

    useEventListener({
        type: "keydown",
        listener: (event) => {
            if (event.code == "KeyH" && event.altKey) {
                editOpen();
            }
        },
    });

    return (
        <ModalDialogCustom
            open={open}
            setOpen={editOpen}
            layout={smScreen ? "fullscreen" : "center"}
            head={
                <Stack
                    sx={{
                        width: "100%",
                    }}
                >
                    <Stack sx={{ mb: 2 }}>
                        <Typography level='h2'>{t("history")}</Typography>
                    </Stack>
                    <Input
                        placeholder={t("search")}
                        value={searchString}
                        onChange={(e) => setSearchString(e.target.value)}
                        startDecorator={<SearchRoundedIcon />}
                        aria-label={t("search")}
                    />
                </Stack>
            }
            minWidth='80%'
            sx={{
                minHeight: "50%",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flex: 1,
                    minHeight: 0,
                    px: 2,
                    py: 3,
                    overflowY: "scroll",
                    flexDirection: "column-reverse",
                }}
            >
                <HistoryList searchString={searchString} />
            </Box>
        </ModalDialogCustom>
    );
}
