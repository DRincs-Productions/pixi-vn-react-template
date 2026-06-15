import { Spinner } from "@/components/ui/spinner";

export function PendingComponent() {
    return (
        <div className="h-screen w-screen">
            <div className="absolute bottom-0 right-0 p-2 animate-in zoom-in-95 fade-in-0">
                <Spinner className="size-10 text-white" />
            </div>
        </div>
    );
}

export function AnimatedDots() {
    return (
        <span className="flex pointer-events-none select-none">
            <span className="animate-bounce [animation-delay:0s]">.</span>
            <span className="animate-bounce [animation-delay:0.2s]">.</span>
            <span className="animate-bounce [animation-delay:0.4s]">.</span>
        </span>
    );
}
