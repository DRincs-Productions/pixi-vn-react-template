import { useDebouncedValue } from "@tanstack/react-pacer";
import { useStore } from "@tanstack/react-store";
import { CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import useNarrationFunctions from "@/hooks/useNarrationFunctions";
import { useQueryChoiceMenuOptions } from "@/hooks/useQueryInterface";
import { GameStatus } from "@/lib/stores/game-status-store";
import { InterfaceSettings } from "@/lib/stores/interface-settings-store";
import { TypewriterSettings } from "@/lib/stores/typewriter-settings-store";

export function ChoiceMenu() {
    const loading = useStore(GameStatus.store, (state) => state.loading);
    const { data: menu = [] } = useQueryChoiceMenuOptions();
    const isTyping = useStore(TypewriterSettings.store, (state) => state.inProgress);
    const hidden = useStore(InterfaceSettings.store, (state) => state.hidden);
    const { selectChoice } = useNarrationFunctions();
    const [debouncedMenu] = useDebouncedValue(isTyping ? [] : menu, { wait: 50 });

    return (
        <div
            className="flex flex-col items-center justify-center gap-2 w-full h-full overflow-auto"
            role="menu"
        >
            {debouncedMenu.map((item, index) => (
                <div
                    key={`choice-${item.choiceIndex}`}
                    className={
                        hidden
                            ? "animate-out fade-out-0 slide-out-to-bottom-[10%]"
                            : "animate-in fade-in-0 slide-in-from-bottom-[10%] fill-mode-backwards"
                    }
                    style={!hidden ? { animationDelay: `${index * 150}ms` } : undefined}
                >
                    <Button
                        disabled={loading}
                        onClick={() => selectChoice(item)}
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
