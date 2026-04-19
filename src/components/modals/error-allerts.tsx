import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { RefreshCwIcon, WifiOffIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import useNetworkDetector from "../../hooks/useNetworkDetector";

export function OfflineAllert() {
    const { t } = useTranslation(["ui"]);
    const { isOnline, retry } = useNetworkDetector();

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
                    <div>{t("offline_hint")}</div>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button variant="outline" onClick={retry} aria-label={t("offline_retry")}>
                        <RefreshCwIcon className="size-4" />
                        {t("offline_retry")}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
