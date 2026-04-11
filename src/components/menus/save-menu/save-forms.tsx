import { useState } from "react";
import { Input } from "@/components/ui/input";

export function SaveForm({
    initialValue,
    onValueChange,
}: {
    initialValue: string;
    onValueChange: (value: string) => void;
}) {
    const [value, setValue] = useState(initialValue);
    return (
        <Input
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
                onValueChange(e.target.value);
            }}
        />
    );
}
