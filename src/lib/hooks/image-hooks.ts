import { getPixiJSAsset } from "@/lib/utils/assets-utility";
import { toUnpicImageUrl } from "@/lib/utils/image-utility";
import { useMemo } from "react";

export function useImageSrc(src?: string | null): string | undefined {
    return useMemo(() => {
        if (!src) {
            return undefined;
        }
        const resolved = getPixiJSAsset(src);
        return toUnpicImageUrl(resolved);
    }, [src]);
}
