import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IconButton, useTheme } from "@mui/joy";
import { useStore } from "@tanstack/react-store";
import { useEffect, useMemo } from "react";
import useEventListener from "../hooks/useKeyDetector";
import { editHidden, interfaceStore, show } from "../stores/useInterfaceStore";

export default function VisibilityButton() {
    const hidden = useStore(interfaceStore, (state) => state.hidden);
    const iconVarians = useMemo(() => (hidden ? `motion-preset-pop` : `motion-scale-out-0`), [hidden]);

    useEffect(() => {
        return () => {
            show();
        };
    }, []);

    useEventListener({
        type: "keyup",
        listener: (event) => {
            if (event.code == "KeyV" && event.altKey) {
                editHidden();
            }
        },
    });

    return (
        <IconButton
            onClick={editHidden}
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
