import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Text-shadow that outlines text with black so it remains legible over any image or canvas background. */
export const overlayTextShadowClass =
    "[text-shadow:0_0_3px_black,0_0_6px_black]";
