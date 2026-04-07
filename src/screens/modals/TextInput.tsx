import { narration } from "@drincs/pixi-vn";
import { Button, Input } from "@mui/joy";
import { useStore } from "@tanstack/react-store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import ModalDialogCustom from "../../components/ModalDialog";
import useGameProps from "../../hooks/useGameProps";
import { useQueryDialogue, useQueryInputValue } from "../../hooks/useQueryInterface";
import { typewriterStore } from "../../stores/useTypewriterStore";

export default function TextInput() {
    const { data: { animatedText: text } = {} } = useQueryDialogue();
    const { data: { isRequired, type, currentValue } = { currentValue: undefined, isRequired: false } } =
        useQueryInputValue<string | number>();
    const typewriterInProgress = useStore(typewriterStore, (state) => state.inProgress);
    const open = !typewriterInProgress && isRequired;
    const [tempValue, setTempValue] = useState<string | number>();
    const gameProps = useGameProps();
    const { t } = useTranslation(["ui"]);
    useEffect(() => {
        setTempValue(currentValue);
    }, [open, currentValue]);

    return (
        <ModalDialogCustom
            open={open}
            setOpen={() => {}}
            canBeIgnored={false}
            color="primary"
            actions={
                <>
                    <Button
                        key={"exit"}
                        color="primary"
                        variant="outlined"
                        onClick={() => {
                            narration.inputValue = tempValue || currentValue;
                            setTempValue(undefined);
                            gameProps.invalidateInterfaceData();
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
