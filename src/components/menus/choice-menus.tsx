import { Button } from "@/components/ui/button";
import useNarrationFunctions from "@/hooks/useNarrationFunctions";
import { useQueryChoiceMenuOptions } from "@/hooks/useQueryInterface";
import { GameStatus } from "@/lib/stores/game-status-store";
import { TextDisplaySettings } from "@/lib/stores/text-display-settings-store";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { useStore } from "@tanstack/react-store";
import { CornerDownLeft } from "lucide-react";

export function ChoiceMenu() {
    const loading = useStore(GameStatus.store, (state) => state.loading);
    const { data: menu = [] } = useQueryChoiceMenuOptions();
    const isTyping = useStore(TextDisplaySettings.store, (state) => state.inProgress);
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
                        "animate-in fade-in-0 slide-in-from-bottom-[10%] fill-mode-backwards"
                    }
                    style={{ animationDelay: `${index * 150}ms` }}
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
