import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * A Dialog wrapper that always occupies the full viewport, with a consistent
 * header bar (title + optional toolbar). The close button is provided by the
 * underlying `DialogContent` and sits at `absolute top-2 right-2`.
 *
 * When `centered` is true the dialog behaves like a normal centered modal at
 * the `lg` breakpoint (used by the save/load menu).
 */
export interface FullscreenDialogContentProps
    extends Omit<React.ComponentProps<typeof DialogContent>, "title"> {
    title: React.ReactNode;
    /** Optional buttons / controls placed on the right side of the header. */
    toolbar?: React.ReactNode;
    /**
     * When `true` the dialog is centered and has a max-width at the `lg`
     * breakpoint (save/load menu behaviour).
     * When `false` (default) the dialog is always fullscreen.
     */
    centered?: boolean;
}

export function FullscreenDialogContent({
    title,
    toolbar,
    centered = false,
    children,
    className,
    ...props
}: FullscreenDialogContentProps) {
    return (
        <DialogContent
            className={cn(
                // Base: full-screen on all viewport sizes
                "flex flex-col p-0 gap-0 overflow-hidden",
                "top-0 left-0 h-full max-h-full w-full max-w-full translate-x-0 translate-y-0 rounded-none",
                // Centered variant: restore normal modal look at lg+
                centered && [
                    "lg:top-1/2 lg:left-1/2",
                    "lg:-translate-x-1/2 lg:-translate-y-1/2",
                    "lg:rounded-xl",
                    "lg:h-auto lg:w-[90vw] lg:max-h-[90vh] lg:max-w-5xl",
                ],
                className,
            )}
            {...props}
        >
            {/* Header – pr-12 leaves room for the absolute close button */}
            <div className="flex shrink-0 items-center justify-between border-b px-4 py-2 pr-12">
                <DialogTitle>{title}</DialogTitle>
                {toolbar && <div className="flex items-center">{toolbar}</div>}
            </div>

            {/* Body */}
            <div className="flex flex-1 min-h-0 flex-col overflow-hidden">{children}</div>
        </DialogContent>
    );
}

export { Dialog };
