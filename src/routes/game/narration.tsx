import { NarrationScreen } from "@/components/screens/narration";
import { NarrationClickOverlay } from "@/components/screens/narration/click-overlay";
import { INTERFACE_DATA_USE_QUERY_KEY } from "@/constants";
import { useNarrationHotkeys } from "@/lib/hooks/hotkeys-hooks";
import { useSkipAutoDetector } from "@/lib/hooks/narration-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/game/narration")({
    component: NarrationElement,
});

function NarrationElement() {
    const queryClient = useQueryClient();
    useSkipAutoDetector();
    useNarrationHotkeys();

    useEffect(() => {
        return () => {
            queryClient.removeQueries({ queryKey: [INTERFACE_DATA_USE_QUERY_KEY] });
        };
    }, [queryClient]);

    return (
        <>
            <NarrationClickOverlay />
            <NarrationScreen />
        </>
    );
}
