import { useEffect, useRef } from "react";

/**
 * A custom hook that sets up an interval to call a callback function.
 * @param callback The callback function to call on each interval.
 * @param options An object containing the delay and enabled state for the interval.
 * @param dependencies The dependencies array that determines when to re-run the effect.
 */
export default function useInterval(
    callback: () => any,
    options: {
        /**
         * The delay in milliseconds between each interval.
         * @default 1000
         */
        delay?: number;
        /**
         * A boolean indicating whether the interval is enabled or not.
         * @default true
         */
        enabled?: boolean;
    },
    dependencies: any[] = []
) {
    const savedCallback = useRef<() => any | null>(null);
    const { delay = 1000, enabled = true } = options;

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            if (savedCallback.current) {
                savedCallback.current();
            }
        }

        if (enabled && delay > 0) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay, enabled, ...dependencies]);
}
