import { narration } from "@drincs/pixi-vn";
import { Button, Input } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useShallow } from "zustand/react/shallow";
import ModalDialogCustom from "../../components/ModalDialog";
import { INTERFACE_DATA_USE_QUEY_KEY, useQueryDialogue, useQueryInputValue } from "../../hooks/useQueryInterface";
import useTypewriterStore from "../../stores/useTypewriterStore";

export default function TextInput() {
    const { data: { animatedText: text } = {} } = useQueryDialogue();
    const { data: { isRequired, type, currentValue } = { currentValue: undefined, isRequired: false } } =
        useQueryInputValue<string | number>();
    const open = useTypewriterStore(useShallow((state) => !state.inProgress && isRequired));
    const [tempValue, setTempValue] = useState<string | number>();
    const queryClient = useQueryClient();
    const { t } = useTranslation(["ui"]);
    useEffect(() => {
        setTempValue(currentValue);
    }, [open, currentValue]);

    return (
        <ModalDialogCustom
            open={open}
            setOpen={() => {}}
            canBeIgnored={false}
            color='primary'
            actions={
                <>
                    <Button
                        key={"exit"}
                        color='primary'
                        variant='outlined'
                        onClick={() => {
                            narration.inputValue = tempValue || currentValue;
                            setTempValue(undefined);
                            queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] });
                        }}
                        disabled={tempValue === undefined || tempValue === ""}
                    >
                        {t("confirm")}
                    </Button>
                    <Input
                        value={tempValue || ""}
                        type={type}
                        onChange={(e) => {
                            let value: any = e.target.value;
                            if (e.target.type === "number") {
                                value = e.target.valueAsNumber;
                            }
                            setTempValue(value);
                        }}
                    />
                </>
            }
        >
            {text && (
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        p: (props) => <span {...props} />,
                    }}
                >
                    {text}
                </Markdown>
            )}
        </ModalDialogCustom>
    );
}
