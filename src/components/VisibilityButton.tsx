import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IconButton, useTheme } from "@mui/joy";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import useEventListener from "../hooks/useKeyDetector";
import useInterfaceStore from "../stores/useInterfaceStore";

export default function VisibilityButton() {
    const hidden = useInterfaceStore(useShallow((state) => state.hidden));
    const editHideInterface = useInterfaceStore((state) => state.editHidden);
    const showInterface = useInterfaceStore((state) => state.show);
    const iconVarians = useMemo(() => (hidden ? `motion-preset-pop` : `motion-scale-out-0`), [hidden]);

    useEffect(() => {
        return () => {
            showInterface();
        };
    }, [showInterface]);

    useEventListener({
        type: "keyup",
        listener: (event) => {
            if (event.code == "KeyV" && event.altKey) {
                editHideInterface();
            }
        },
    });

    return (
        <IconButton
            onClick={editHideInterface}
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
