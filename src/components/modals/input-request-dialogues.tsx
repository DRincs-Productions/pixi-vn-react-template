import { narration } from "@drincs/pixi-vn";
import { useHotkeys } from "@tanstack/react-hotkeys";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { useStore } from "@tanstack/react-store";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useGameProps from "@/hooks/useGameProps";
import { useQueryDialogue, useQueryInputValue } from "@/hooks/useQueryInterface";
import { TextDisplaySettings } from "@/lib/stores/text-display-settings-store";

export function InputRequestDialog() {
    const { data: { animatedText: text } = {} } = useQueryDialogue();
    const {
        data: { isRequired, type, currentValue } = { currentValue: undefined, isRequired: false },
    } = useQueryInputValue<string | number>();
    const isTyping = useStore(TextDisplaySettings.store, (state) => state.inProgress);
    const [open] = useDebouncedValue(!isTyping && isRequired, { wait: 50 });
    const [tempValue, setTempValue] = useState<string | number>();
    const gameProps = useGameProps();
    const { t } = useTranslation(["ui"]);

    useEffect(() => {
        setTempValue(currentValue);
    }, [currentValue]);

    const canConfirm = tempValue !== undefined && tempValue !== "";

    const submitInputValue = useCallback(() => {
        if (!canConfirm) {
            return;
        }
        narration.inputValue = tempValue || currentValue;
        setTempValue(undefined);
        gameProps.invalidateInterfaceData();
    }, [canConfirm, currentValue, gameProps, tempValue]);

    useHotkeys([
        {
            hotkey: "Enter",
            callback: submitInputValue,
            options: {
                enabled: open,
                meta: {
                    name: t("confirm"),
                    description: t("confirm_input_hotkey_description"),
                },
            },
        },
    ]);

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
                        switch (e.target.type) {
                            case "number":
                                setTempValue(e.target.valueAsNumber);
                                break;
                            default:
                                setTempValue(e.target.value);
                        }
                    }}
                />
                <DialogFooter>
                    <Button disabled={!canConfirm} onClick={submitInputValue}>
                        {t("confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
