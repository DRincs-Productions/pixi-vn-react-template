import { HotkeysProvider } from "@tanstack/react-hotkeys";
import { AlertDialogProvider } from "@/components/providers/AlertDialogProvider";
import MyThemeProvider from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

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
