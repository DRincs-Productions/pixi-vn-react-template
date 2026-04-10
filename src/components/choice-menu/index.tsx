import { useDebouncedValue } from "@tanstack/react-pacer";
import { useStore } from "@tanstack/react-store";
import { CornerDownLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import useNarrationFunctions from "../../hooks/useNarrationFunctions";
import { useQueryChoiceMenuOptions } from "../../hooks/useQueryInterface";
import { GameStatus } from "../../stores/game-status-store";
import { InterfaceSettings } from "../../stores/interface-settings-store";
import { TypewriterSettings } from "../../stores/typewriter-settings-store";

export default function ChoiceMenu() {
    const nextStepLoading = useStore(GameStatus.store, (state) => state.loading);
    const { data: menu = [] } = useQueryChoiceMenuOptions();
    const typewriterInProgress = useStore(TypewriterSettings.store, (state) => state.inProgress);
    const hidden = useStore(InterfaceSettings.store, (state) => state.hidden);
    const { selectChoice } = useNarrationFunctions();
    const [open, setOpen] = useState(false);

    const [debouncedOpen] = useDebouncedValue(!(hidden || menu.length === 0 || typewriterInProgress), { wait: 100 });
    useEffect(() => {
        setOpen(debouncedOpen);
    }, [debouncedOpen]);

    if (!open) return null;

    return (
        <div
            className="flex flex-col items-center justify-center gap-2 w-full h-full overflow-auto"
            style={{ pointerEvents: hidden ? "none" : "auto" }}
            role="menu"
        >
            {menu.map((item, index) => (
                <div
                    key={"choice-" + index}
                    className={
                        hidden
                            ? "motion-opacity-out-0 motion-translate-y-out-[50%]"
                            : "motion-opacity-in-0 motion-translate-y-in-[50%]"
                    }
                    style={!hidden ? { animationDelay: `${index * 200}ms` } : undefined}
                >
                    <Button
                        disabled={nextStepLoading}
                        onClick={() =>
                            selectChoice(item).then(() => {
                                setOpen(false);
                            })
                        }
                        size="sm"
                        variant="outline"
                    >
                        {item.type === "close" && <CornerDownLeft />}
                        {item.text}
                    </Button>
                </div>
            ))}
        </div>
    );
}
