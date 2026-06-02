import { useImageSrc } from "@/lib/hooks/image-hooks";
import { Image as UnpicImage, type ImageProps } from "@unpic/react";
import { ImageOff } from "lucide-react";

export function Image({
    src,
    loading = "lazy",
    ...props
}: ImageProps) {
    const resolvedSrc = useImageSrc(src);

    if (!resolvedSrc) {
        return <ImageOff className={props.className} />;
    }

    return <UnpicImage src={resolvedSrc as ImageProps["src"]} loading={loading} {...props} />;
}
