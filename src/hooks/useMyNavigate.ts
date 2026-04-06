import { Assets } from "@drincs/pixi-vn";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useCallback } from "react";

/**
 * https://pixi-vn.web.app/it/start/interface-navigate#block-back-forward
 */
export default function useMyNavigate() {
    const navigate = useNavigate();
    const router = useRouter();

    return useCallback(
        async (to: string | number) => {
            if (typeof to === "number") {
                router.history.go(to);
            } else {
                Assets.backgroundLoadBundle(to);
                await navigate({ to });
            }
            window.history.pushState(null, window.location.href, window.location.href);
        },
        [navigate, router],
    );
}
