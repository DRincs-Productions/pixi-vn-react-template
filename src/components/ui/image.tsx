import { useImageSrc } from "@/lib/hooks/image-hooks";
import { Image as UnpicImage } from "@unpic/react";
import type * as React from "react";

export function Image({
    src,
    loading = "lazy",
    width,
    height,
    ...props
}: React.ComponentProps<"img">) {
    const resolvedSrc = useImageSrc(src);

    if (!resolvedSrc) {
        return null;
    }

    const parsedWidth =
        typeof width === "number" ? width : width ? Number.parseFloat(width) : undefined;
    const parsedHeight =
        typeof height === "number" ? height : height ? Number.parseFloat(height) : undefined;

    if (
        parsedWidth !== undefined &&
        parsedHeight !== undefined &&
        Number.isFinite(parsedWidth) &&
        Number.isFinite(parsedHeight) &&
        parsedWidth > 0 &&
        parsedHeight > 0
    ) {
        return (
            <UnpicImage
                src={resolvedSrc}
                width={parsedWidth}
                height={parsedHeight}
                layout="constrained"
                loading={loading}
                {...props}
            />
        );
    }

    return <UnpicImage src={resolvedSrc} layout="fullWidth" loading={loading} {...props} />;
}
