import { getPixiJSAsset } from "@/lib/utils/assets-utility";
import { useMemo } from "react";

export function useImageSrc(src?: string | null): string | undefined {
    return useMemo(() => {
        if (!src) {
            return undefined;
        }
        return getPixiJSAsset(src);
    }, [src]);
}
