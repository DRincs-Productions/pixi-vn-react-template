import { useState } from "react";
import { useTranslation } from "react-i18next";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

export function SaveNameInput({
    initialValue,
    onValueChange,
}: {
    initialValue: string;
    onValueChange: (value: string) => void;
}) {
    const { t } = useTranslation(["ui"]);
    const [value, setValue] = useState(initialValue);
    return (
        <>
            <label className="text-sm font-medium">{t("save_name")}</label>
            <InputGroup>
                <InputGroupInput
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        onValueChange(e.target.value);
                    }}
                />
            </InputGroup>
        </>
    );
}
