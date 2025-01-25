import { NavigateFunction, NavigateOptions, To, useNavigate } from "react-router-dom";

/**
 * https://pixi-vn.web.app/advanced/intercept-events.html#back-and-forward-buttons
 */
export function useMyNavigate(): NavigateFunction {
    const navigate = useNavigate();

    return (to: To | number, options?: NavigateOptions) => {
        if (typeof to === "number") {
            navigate(to);
        } else {
            navigate(to, options);
        }
        window.history.pushState(null, window.location.href, window.location.href);
    };
}
