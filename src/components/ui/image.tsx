import { useImageSrc } from "@/lib/hooks/image-hooks";
import type * as React from "react";

// biome-ignore lint/a11y/useAltText: consumer is responsible for passing alt
export function Image({ src, loading = "lazy", ...props }: React.ComponentProps<"img">) {
    const resolvedSrc = useImageSrc(src);
    return <img src={resolvedSrc} loading={loading} {...props} />;
}
