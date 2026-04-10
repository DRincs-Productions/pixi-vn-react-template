import { HotkeysProvider } from "@tanstack/react-hotkeys";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AlertDialogProvider } from "@/providers/AlertDialogProvider";
import MyThemeProvider from "@/providers/ThemeProvider";

export default function RootProvider({ children }: { children: React.ReactNode }) {
    return (
        <MyThemeProvider>
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
        </MyThemeProvider>
    );
}
