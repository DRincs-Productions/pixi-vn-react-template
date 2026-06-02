import { useImageSrc } from "@/lib/hooks/image-hooks";
import { Image as UnpicImage, type ImageProps } from "@unpic/react";
import type * as React from "react";

export function Image({
    src,
    loading = "lazy",
    ...props
}: React.ComponentProps<"img">) {
    const resolvedSrc = useImageSrc(src) ?? "";

    return <UnpicImage {...({ src: resolvedSrc, loading, ...props } as ImageProps)} />;
}
