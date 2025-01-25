import { narration } from "@drincs/pixi-vn";
import { Button, Input } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ModalDialogCustom from "../../components/ModalDialog";
import Typewriter from "../../components/Typewriter";
import useTypewriterStore from "../../stores/useTypewriterStore";
import { INTERFACE_DATA_USE_QUEY_KEY, useQueryDialogue, useQueryInputValue } from "../../use_query/useQueryInterface";

export default function TextInput() {
    const { data: { text } = {} } = useQueryDialogue();
    const { data: { isRequired, type, currentValue } = { currentValue: undefined, isRequired: false } } =
        useQueryInputValue<string | number>();
    const open = useTypewriterStore((state) => !state.inProgress && isRequired);
    const [tempValue, setTempValue] = useState<string | number>();
    const queryClient = useQueryClient();
    const { t } = useTranslation(["ui"]);

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
                    >
                        {t("confirm")}
                    </Button>
                    {open && (
                        <Input
                            defaultValue={currentValue || ""}
                            type={type}
                            onChange={(e) => {
                                let value: any = e.target.value;
                                if (e.target.type === "number") {
                                    value = e.target.valueAsNumber;
                                }
                                setTempValue(value);
                            }}
                        />
                    )}
                </>
            }
        >
            {text && <Typewriter text={text} />}
        </ModalDialogCustom>
    );
}
