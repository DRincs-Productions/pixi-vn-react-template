import { Spinner } from "@/components/ui/spinner";

export default function LoadingScreen() {
    return (
        <div className="h-screen w-screen">
            <div className="absolute bottom-0 right-0 p-2 motion-preset-pop">
                <Spinner className="size-10 text-white" />
            </div>
        </div>
    );
}
