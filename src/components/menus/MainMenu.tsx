import { canvas, Game, ImageSprite } from "@drincs/pixi-vn";
import { useHotkeys } from "@tanstack/react-hotkeys";
import { useQueryClient } from "@tanstack/react-query";
import { CirclePlay, Play, Save, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import packageJson from "@/../package.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CANVAS_UI_LAYER_NAME } from "@/constans";
import useGameProps from "@/hooks/useGameProps";
import { INTERFACE_DATA_USE_QUEY_KEY as INTERFACE_DATA_USE_QUERY_KEY } from "@/hooks/useQueryInterface";
import useQueryLastSave from "@/hooks/useQueryLastSave";
import { useSetSearchParamState } from "@/hooks/useSearchParamState";
import startLabel from "@/labels/startLabel";
import { InterfaceSettings } from "@/lib/stores/interface-settings-store";
import { cn } from "@/lib/utils";
import { loadSave } from "@/utils/save-utility";

const menuButtonClass =
    "justify-start hover:scale-105 focus-visible:scale-105 transition-transform duration-150 ease-out";

/** Text-shadow outline so the text is readable on any background colour */
const infoShadowClass = "[text-shadow:0_0_3px_#000,0_0_6px_#000]";

export default function MainMenu() {
    const queryClient = useQueryClient();
    const { data: lastSave = null, isLoading } = useQueryLastSave();
    const gameProps = useGameProps();
    const { uiTransition: t, navigate, toast } = gameProps;
    const setSaves = useSetSearchParamState<boolean>("saves");
    const setSettings = useSetSearchParamState<boolean>("settings");
    const [loading, setLoading] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    /** Returns all enabled menuitem buttons inside the menu container. */
    function getMenuItems(): HTMLButtonElement[] {
        if (!menuRef.current) return [];
        return Array.from(
            menuRef.current.querySelectorAll<HTMLButtonElement>(
                "button[role='menuitem']:not(:disabled)",
            ),
        );
    }

    /** Arrow-key navigation between menu items. */
    function focusMenuItem(direction: "up" | "down" | "home" | "end") {
        const items = getMenuItems();
        if (!items.length) return;

        const active = document.activeElement as HTMLElement;
        const currentIndex = items.indexOf(active as HTMLButtonElement);

        let next = -1;
        if (direction === "down") {
            next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        } else if (direction === "up") {
            next = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        } else if (direction === "home") {
            next = 0;
        } else if (direction === "end") {
            next = items.length - 1;
        }
        if (next >= 0 && next < items.length) {
            items[next].focus();
        }
    }

    useHotkeys(
        [
            {
                hotkey: "ArrowDown",
                callback: () => focusMenuItem("down"),
                options: { preventDefault: true },
            },
            {
                hotkey: "ArrowUp",
                callback: () => focusMenuItem("up"),
                options: { preventDefault: true },
            },
            {
                hotkey: "Home",
                callback: () => focusMenuItem("home"),
                options: { preventDefault: true },
            },
            {
                hotkey: "End",
                callback: () => focusMenuItem("end"),
                options: { preventDefault: true },
            },
        ],
        { target: menuRef },
    );

    useEffect(() => {
        InterfaceSettings.setHidden(false);
        const bg = new ImageSprite({}, "background_main_menu");
        bg.load();
        const layer = canvas.getLayer(CANVAS_UI_LAYER_NAME);
        if (layer) {
            layer.addChild(bg);
        }

        // Auto-focus the first enabled button so arrow-key navigation works immediately.
        const firstItem = menuRef.current?.querySelector<HTMLButtonElement>(
            "button[role='menuitem']:not(:disabled)",
        );
        firstItem?.focus();

        return () => {
            canvas.getLayer(CANVAS_UI_LAYER_NAME)?.removeChildren();
        };
    }, []);

    return (
        <div className="relative h-full w-full flex items-center justify-start p-3 sm:p-6 md:p-10">
            {/* Buttons card – semi-transparent, fade-in from left on mount */}
            <Card className="w-full max-w-xs sm:max-w-sm bg-background/50 backdrop-blur-sm animate-in fade-in slide-in-from-left-10 duration-500 ease-out fill-mode-both">
                <CardContent
                    ref={menuRef}
                    role="menu"
                    className="flex flex-col gap-2 pt-4"
                >
                    <Button
                        role="menuitem"
                        onClick={() => {
                            if (!lastSave) {
                                return;
                            }
                            setLoading(true);
                            loadSave(lastSave, (to) => navigate({ to }))
                                .then(() =>
                                    queryClient.invalidateQueries({
                                        queryKey: [INTERFACE_DATA_USE_QUERY_KEY],
                                    }),
                                )
                                .catch((e) => {
                                    toast.error(t("fail_load"));
                                    console.error(e);
                                })
                                .finally(() => setLoading(false));
                        }}
                        disabled={(!isLoading && !lastSave) || loading}
                        className={menuButtonClass}
                    >
                        {isLoading ? (
                            <>
                                <Spinner className="size-4" />
                                <span className="sr-only">Loading</span>
                            </>
                        ) : (
                            <CirclePlay className="size-4" />
                        )}
                        {t("continue")}
                    </Button>

                    <Button
                        role="menuitem"
                        onClick={async () => {
                            setLoading(true);
                            await navigate({ to: "/game/narration" });
                            Game.start(startLabel, gameProps)
                                .then(() =>
                                    queryClient.invalidateQueries({
                                        queryKey: [INTERFACE_DATA_USE_QUERY_KEY],
                                    }),
                                )
                                .finally(() => setLoading(false));
                        }}
                        disabled={loading}
                        className={menuButtonClass}
                    >
                        <Play className="size-4" />
                        {t("start")}
                    </Button>

                    <Button
                        role="menuitem"
                        onClick={() => setSaves(true)}
                        disabled={loading}
                        variant="outline"
                        className={menuButtonClass}
                    >
                        <Save className="size-4" />
                        {t("load")}
                    </Button>

                    <Button
                        role="menuitem"
                        onClick={() => setSettings(true)}
                        disabled={loading}
                        variant="outline"
                        className={menuButtonClass}
                    >
                        <Settings className="size-4" />
                        {t("settings")}
                    </Button>

                    {loading ? (
                        <div
                            className="flex items-center justify-end pt-1 text-muted-foreground"
                            aria-live="polite"
                        >
                            <Spinner />
                            <span className="sr-only">Loading</span>
                        </div>
                    ) : null}
                </CardContent>
            </Card>

            {/* Game name + version – bottom right, outlined for readability on any bg */}
            <div className="absolute bottom-3 right-3 text-right select-none pointer-events-none">
                <p className={cn("text-xs font-semibold text-white", infoShadowClass)}>
                    {packageJson.name}
                </p>
                <p className={cn("text-[0.65rem] text-white/80", infoShadowClass)}>
                    v{packageJson.version}
                </p>
            </div>
        </div>
    );
}
