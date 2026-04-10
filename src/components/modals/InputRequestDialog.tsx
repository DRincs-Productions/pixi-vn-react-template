import { narration } from "@drincs/pixi-vn";
import { useStore } from "@tanstack/react-store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useGameProps from "../../hooks/useGameProps";
import { useQueryDialogue, useQueryInputValue } from "../../hooks/useQueryInterface";
import { TypewriterSettings } from "../../stores/typewriter-settings-store";

export default function InputRequestDialog() {
    const { data: { animatedText: text } = {} } = useQueryDialogue();
    const { data: { isRequired, type, currentValue } = { currentValue: undefined, isRequired: false } } =
        useQueryInputValue<string | number>();
    const open = useStore(TypewriterSettings.store, (state) => !state.inProgress && isRequired);
    const [tempValue, setTempValue] = useState<string | number>();
    const gameProps = useGameProps();
    const { t } = useTranslation(["ui"]);

    useEffect(() => {
        setTempValue(currentValue);
    }, [open, currentValue]);

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false}>
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
                <Input
                    value={tempValue ?? ""}
                    type={type}
                    onChange={(e) => {
                        let value: string | number = e.target.value;
                        if (e.target.type === "number") {
                            value = e.target.valueAsNumber;
                        }
                        setTempValue(value);
                    }}
                />
                <DialogFooter>
                    <Button
                        disabled={tempValue === undefined || tempValue === ""}
                        onClick={() => {
                            narration.inputValue = tempValue || currentValue;
                            setTempValue(undefined);
                            gameProps.invalidateInterfaceData();
                        }}
                    >
                        {t("confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
