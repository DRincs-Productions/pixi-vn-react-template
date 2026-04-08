import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IconButton, useTheme } from "@mui/joy";
import { useHotkeys } from "@tanstack/react-hotkeys";
import { useStore } from "@tanstack/react-store";
import { useEffect, useMemo } from "react";
import { interfaceStore, showInterface, toggleInterfaceHidden } from "../stores/useInterfaceStore";

export default function VisibilityButton() {
    const hidden = useStore(interfaceStore, (state) => state.hidden);
    const iconVarians = useMemo(() => (hidden ? `motion-preset-pop` : `motion-scale-out-0`), [hidden]);

    useEffect(() => {
        return () => {
            showInterface();
        };
    }, []);

    useHotkeys([
        {
            hotkey: "Control+V",
            callback: toggleInterfaceHidden,
        },
    ]);

    return (
        <IconButton
            onClick={toggleInterfaceHidden}
            sx={{
                position: "absolute",
                top: 0,
                right: 0,
            }}
            className={iconVarians}
        >
            <VisibilityOffIcon
                sx={{
                    color: useTheme().palette.neutral[500],
                }}
            />
        </IconButton>
    );
}
