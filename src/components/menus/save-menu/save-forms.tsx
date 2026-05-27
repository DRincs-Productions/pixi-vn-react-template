import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

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
        <Field>
            <FieldLabel>{t("save_name")}</FieldLabel>
            <Input
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    onValueChange(e.target.value);
                }}
            />
        </Field>
    );
}
