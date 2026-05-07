import { AlertDialogProvider } from "@/components/providers/AlertDialogProvider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HotkeysProvider } from "@tanstack/react-hotkeys";

export default function RootProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <HotkeysProvider
                defaultOptions={{
                    hotkey: { preventDefault: true },
                }}
            >
                <AlertDialogProvider>
                    <TooltipProvider>{children}</TooltipProvider>
                </AlertDialogProvider>
                <Toaster position="top-center" />
            </HotkeysProvider>
        </ThemeProvider>
    );
}
