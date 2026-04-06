import { useNavigate } from "@tanstack/react-router";

/**
 * https://pixi-vn.web.app/advanced/intercept-events.html#back-and-forward-buttons
 */
export function useMyNavigate(): (path: string) => void {
    const navigate = useNavigate();

    return (path: string) => {
        navigate({ to: path });
        window.history.pushState(null, window.location.href, window.location.href);
    }
}
