import { useEffect, useRef } from "react";
import { tinykeys } from "tinykeys";

type Keymap = Parameters<typeof tinykeys>[1];

export default function useHotkeys(keymap: Keymap) {
    const keymapRef = useRef(keymap);

    useEffect(() => {
        keymapRef.current = keymap;
    });

    useEffect(() => {
        const keys = Object.keys(keymapRef.current);
        return tinykeys(
            window,
            Object.fromEntries(keys.map((key) => [key, (e: KeyboardEvent) => keymapRef.current[key]?.(e)])),
        );
    }, []);
}
