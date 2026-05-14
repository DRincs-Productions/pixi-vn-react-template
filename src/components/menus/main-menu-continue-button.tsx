import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { INTERFACE_DATA_USE_QUEY_KEY as INTERFACE_DATA_USE_QUERY_KEY } from "@/lib/query/interface-query";
import { useQueryLastSave } from "@/lib/query/save-query";
import { loadSave } from "@/lib/utils/save-utility";
import { useQueryClient } from "@tanstack/react-query";
import { CirclePlay, TriangleAlert } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const menuButtonClass =
    "justify-start hover:scale-105 focus-visible:scale-105 transition-transform duration-150 ease-out";

interface ContinueMenuButtonProps {
    /** Disables the button when another action is in progress. */
    disabled?: boolean;
    /** Called when the continue action starts or finishes loading. */
    onLoadingChange?: (loading: boolean) => void;
}

export function ContinueMenuButton({
    disabled = false,
    onLoadingChange,
}: ContinueMenuButtonProps) {
    const { data: lastSave = null, isLoading } = useQueryLastSave();
    const { t } = useTranslation(["ui"]);
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const hasRefreshSave = lastSave?.id === -1;

    const handleClick = useCallback(() => {
        if (!lastSave) return;
        setLoading(true);
        onLoadingChange?.(true);
        loadSave(lastSave)
            .then(() =>
                queryClient.invalidateQueries({
                    queryKey: [INTERFACE_DATA_USE_QUERY_KEY],
                }),
            )
            .catch((e) => {
                toast.error(t("fail_load"));
                console.error(e);
            })
            .finally(() => {
                setLoading(false);
                onLoadingChange?.(false);
            });
    }, [lastSave, queryClient, t, onLoadingChange]);

    const isDisabled = (!isLoading && !lastSave) || loading || disabled;

    const buttonContent = (
        <>
            {isLoading || loading ? (
                <Spinner className="size-4" />
            ) : (
                <CirclePlay className="size-4" />
            )}
            {t("continue")}
            {hasRefreshSave ? (
                <TriangleAlert aria-hidden="true" className="ml-1 size-4 text-orange-500" />
            ) : null}
        </>
    );

    if (hasRefreshSave) {
        return (
            <Tooltip>
                <TooltipTrigger
                    render={
                        <Button
                            role="menuitem"
                            onClick={handleClick}
                            disabled={isDisabled}
                            className={menuButtonClass}
                        >
                            {buttonContent}
                        </Button>
                    }
                />
                <TooltipContent>{t("continue_refresh_save_tooltip")}</TooltipContent>
            </Tooltip>
        );
    }

    return (
        <Button
            role="menuitem"
            onClick={handleClick}
            disabled={isDisabled}
            className={menuButtonClass}
        >
            {buttonContent}
        </Button>
    );
}
