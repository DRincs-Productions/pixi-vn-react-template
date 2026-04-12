import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IconButton, useTheme } from "@mui/joy";
import { useHotkeys } from "@tanstack/react-hotkeys";
import { useStore } from "@tanstack/react-store";
import { useEffect, useMemo } from "react";
import { InterfaceSettings } from "../lib/stores/interface-settings-store";

export default function VisibilityButton() {
    const hidden = useStore(InterfaceSettings.store, (state) => state.hidden);
    const iconVarians = useMemo(
        () => (hidden ? `animate-in zoom-in-95 fade-in-0` : `animate-out zoom-out-0 fade-out-0`),
        [hidden],
    );

    useEffect(() => {
        return () => {
            InterfaceSettings.show();
        };
    }, []);

    useHotkeys([
        {
            hotkey: "Control+V",
            callback: InterfaceSettings.toggleHidden,
        },
    ]);

    return (
        <IconButton
            onClick={InterfaceSettings.toggleHidden}
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
