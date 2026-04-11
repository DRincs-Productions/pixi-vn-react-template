import { canvas, Game, ImageSprite } from "@drincs/pixi-vn";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CANVAS_UI_LAYER_NAME } from "@/constans";
import useGameProps from "@/hooks/useGameProps";
import { useSetSearchParamState } from "@/hooks/useSearchParamState";
import { INTERFACE_DATA_USE_QUEY_KEY as INTERFACE_DATA_USE_QUERY_KEY } from "@/hooks/useQueryInterface";
import useQueryLastSave from "@/hooks/useQueryLastSave";
import startLabel from "@/labels/startLabel";
import { InterfaceSettings } from "@/lib/stores/interface-settings-store";
import { loadSave } from "@/utils/save-utility";
import packageJson from "../../../package.json";

export default function MainMenu() {
    const queryClient = useQueryClient();
    const { data: lastSave = null, isLoading } = useQueryLastSave();
    const gameProps = useGameProps();
    const { uiTransition: t, navigate, toast } = gameProps;
    const setSaves = useSetSearchParamState<boolean>("saves");
    const setSettings = useSetSearchParamState<boolean>("settings");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        InterfaceSettings.setHidden(false);
        const bg = new ImageSprite({}, "background_main_menu");
        bg.load();
        const layer = canvas.getLayer(CANVAS_UI_LAYER_NAME);
        if (layer) {
            layer.addChild(bg);
        }

        return () => {
            canvas.getLayer(CANVAS_UI_LAYER_NAME)?.removeChildren();
        };
    }, []);

    return (
        <div className="h-full w-full flex items-center justify-start p-4 sm:p-6 md:p-10">
            <Card className="w-full max-w-sm bg-background/90 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>{packageJson.name}</CardTitle>
                    <CardDescription>v{packageJson.version}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Button
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
                        className="justify-start"
                    >
                        {isLoading ? (
                            <>
                                <Spinner className="size-4" />
                                <span className="sr-only">Loading</span>
                            </>
                        ) : null}
                        {t("continue")}
                    </Button>

                    <Button
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
                        className="justify-start"
                    >
                        {t("start")}
                    </Button>

                    <Button
                        onClick={() => setSaves(true)}
                        disabled={loading}
                        variant="outline"
                        className="justify-start"
                    >
                        {t("load")}
                    </Button>

                    <Button
                        onClick={() => setSettings(true)}
                        disabled={loading}
                        variant="outline"
                        className="justify-start"
                    >
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
        </div>
    );
}
