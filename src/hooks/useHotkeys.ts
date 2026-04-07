import { useEffect, useRef } from "react";
import { tinykeys } from "tinykeys";

type Keymap = Parameters<typeof tinykeys>[1];

/**
 * Registers keyboard shortcuts using tinykeys.
 *
 * The set of keys in `keymap` must remain constant across renders (same keys,
 * different handlers is fine). Adding or removing keys after mount has no effect.
 */
export default function useHotkeys(keymap: Keymap) {
    const keymapRef = useRef(keymap);
    // Update ref synchronously during render so handlers always reflect the latest closures.
    keymapRef.current = keymap;

    useEffect(() => {
        const keys = Object.keys(keymapRef.current);
        return tinykeys(
            window,
            Object.fromEntries(keys.map((key) => [key, (e: KeyboardEvent) => keymapRef.current[key]?.(e)])),
        );
    }, []);
}
