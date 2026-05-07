import { XIcon } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * Props for FullscreenDialogContent.
 *
 * `title` is intentionally excluded from the base `DialogContent` props and
 * redefined here as `React.ReactNode` so that any renderable value (string,
 * translated node, etc.) can be passed without conflict with the HTML `title`
 * attribute that would otherwise come through from `DialogPrimitive.Popup`.
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
            showCloseButton={false}
            className={cn(
                // Base: full-screen on all viewport sizes.
                // sm:max-w-full overrides the base DialogContent's sm:max-w-sm.
                "flex flex-col p-0 gap-0 overflow-hidden",
                "top-0 left-0 h-full max-h-full w-full max-w-full sm:max-w-full translate-x-0 translate-y-0 rounded-none",
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
            {/* Header – title | optional toolbar | close button, all in one flex row */}
            <div className="flex shrink-0 items-center border-b px-4 py-2">
                <DialogTitle className="flex-1 text-xl font-bold">{title}</DialogTitle>
                {toolbar && <div className="flex items-center">{toolbar}</div>}
                <DialogClose render={<Button variant="ghost" size="icon-sm" />}>
                    <XIcon />
                </DialogClose>
            </div>

            {/* Body */}
            <div className="flex flex-1 min-h-0 flex-col overflow-hidden">{children}</div>
        </DialogContent>
    );
}

export { Dialog };
