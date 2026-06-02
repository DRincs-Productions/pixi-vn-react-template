import { useImageSrc } from "@/lib/hooks/image-hooks";
import { Image as UnpicImage, type ImageProps } from "@unpic/react";
import { ImageOff } from "lucide-react";

export function Image({
    src,
    loading = "lazy",
    ...props
}: Omit<ImageProps, "src"> & { src?: ImageProps["src"] | null }) {
    const resolvedSrc = useImageSrc(src);

    if (!resolvedSrc) {
        return (
            <ImageOff aria-label={props.alt ?? "Image unavailable"} className={props.className} />
        );
    }

    return <UnpicImage {...({ src: resolvedSrc, loading, ...props } as ImageProps)} />;
}
