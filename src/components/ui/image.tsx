import { getPixiJSAsset } from "@/lib/utils/assets-utility";
import { toUnpicImageUrl } from "@/lib/utils/image-utility";
import { Image as UnpicImage } from "@unpic/react";
import type * as React from "react";
import { useMemo } from "react";

export function Image({
    src,
    loading = "lazy",
    width,
    height,
    ...props
}: React.ComponentProps<"img">) {
    const resolvedSrc = useMemo(() => {
        if (!src) {
            return undefined;
        }
        const resolved = getPixiJSAsset(src);
        return toUnpicImageUrl(resolved);
    }, [src]);

    const parsedWidth =
        typeof width === "number" ? width : width ? Number.parseFloat(width) : undefined;
    const parsedHeight =
        typeof height === "number" ? height : height ? Number.parseFloat(height) : undefined;

    if (parsedWidth && parsedHeight) {
        return (
            <UnpicImage
                src={resolvedSrc ?? ""}
                width={parsedWidth}
                height={parsedHeight}
                layout="constrained"
                loading={loading}
                {...props}
            />
        );
    }

    return <UnpicImage src={resolvedSrc ?? ""} layout="fullWidth" loading={loading} {...props} />;
}
