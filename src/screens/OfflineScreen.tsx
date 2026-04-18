import { useStore } from "@tanstack/react-store";
import { LoaderCircleIcon, RefreshCwIcon, WifiOffIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import useNetworkDetector from "../hooks/useNetworkDetector";
import { NetworkStore } from "../lib/stores/useNetworkStore";

export default function OfflineScreen() {
    const { t } = useTranslation(["ui"]);
    useNetworkDetector();
    const isOnline = useStore(NetworkStore.store, (state) => state.isOnline);
    const isChecking = useStore(NetworkStore.store, (state) => state.isChecking);

    if (isOnline) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-background/70 p-4 backdrop-blur-md animate-in fade-in-0">
            <Card className="w-full max-w-md border-destructive/30 shadow-2xl">
                <CardHeader className="items-center text-center">
                    <div className="mb-2 inline-flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                        <WifiOffIcon className="size-7" />
                    </div>
                    <CardTitle>{t("offline_title")}</CardTitle>
                    <CardDescription>{t("offline_description")}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                    {isChecking ? (
                        <div className="inline-flex items-center gap-2">
                            <LoaderCircleIcon className="size-4 animate-spin" />
                            {t("offline_checking")}
                        </div>
                    ) : (
                        <div>{t("offline_hint")}</div>
                    )}
                </CardContent>
                <CardFooter className="justify-center">
                    <Button
                        variant="outline"
                        onClick={NetworkStore.requestCheck}
                        aria-label={t("offline_retry")}
                    >
                        <RefreshCwIcon className="size-4" />
                        {t("offline_retry")}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
