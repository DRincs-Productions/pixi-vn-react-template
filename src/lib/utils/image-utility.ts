/** Base URL for unpic.pics image optimization CDN. */
export const UNPIC_PREFIX = "https://unpic.pics/img/";

/**
 * Converts an image URL to use unpic.pics for CDN delivery and optimization.
 * Local paths (data:, blob:, /, ./) are returned as-is.
 */
export function toUnpicImageUrl(src?: string | null): string | undefined {
    if (!src) {
        return undefined;
    }

    if (
        src.startsWith(UNPIC_PREFIX) ||
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
            return `${UNPIC_PREFIX}${encodeURIComponent(src)}`;
        }
    } catch {
        return src;
    }

    return src;
}
