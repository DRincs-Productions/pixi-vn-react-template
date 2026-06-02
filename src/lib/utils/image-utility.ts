const unpicPrefix = "https://unpic.pics/img/";

export function toUnpicImageUrl(src?: string | null) {
    if (!src) {
        return src;
    }

    if (
        src.startsWith(unpicPrefix) ||
        src.startsWith("data:") ||
        src.startsWith("blob:") ||
        src.startsWith("/") ||
        src.startsWith("./") ||
        src.startsWith("../")
    ) {
        return src;
    }

    try {
        const url = new URL(src);
        if (url.protocol === "http:" || url.protocol === "https:") {
            return `${unpicPrefix}${encodeURIComponent(src)}`;
        }
    } catch {
        return src;
    }

    return src;
}
