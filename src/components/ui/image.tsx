import { getPixiJSAsset } from "@/lib/utils/assets-utility";
import { toUnpicImageUrl } from "@/lib/utils/image-utility";
import type * as React from "react";
import { useMemo } from "react";

// biome-ignore lint/a11y/useAltText: consumer is responsible for passing alt
export function Image({ src, loading = "lazy", ...props }: React.ComponentProps<"img">) {
    const resolvedSrc = useMemo(() => {
        if (!src) {
            return undefined;
        }
        const resolved = getPixiJSAsset(src);
        return toUnpicImageUrl(resolved);
    }, [src]);
    return <img src={resolvedSrc} loading={loading} {...props} />;
}
