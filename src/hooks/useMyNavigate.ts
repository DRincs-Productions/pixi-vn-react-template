import { Assets } from "@drincs/pixi-vn";
import { NavigateFunction, NavigateOptions, To, useNavigate } from "react-router-dom";

/**
 * https://pixi-vn.web.app/it/start/interface-navigate#block-back-forward
 */
export default function useMyNavigate(): NavigateFunction {
    const navigate = useNavigate();

    return async (to: To | number, options?: NavigateOptions) => {
        if (typeof to === "number") {
            await navigate(to);
        } else {
            Assets.backgroundLoadBundle(to as string);
            await navigate(to, options);
        }
        window.history.pushState(null, window.location.href, window.location.href);
    };
}
