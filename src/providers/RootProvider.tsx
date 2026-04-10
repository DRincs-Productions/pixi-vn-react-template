import { HotkeysProvider } from "@tanstack/react-hotkeys";
import { Toaster } from "@/components/ui/sonner";
import { AlertDialogProvider } from "./AlertDialogProvider";
import MyThemeProvider from "./ThemeProvider";

export default function RootProvider({ children }: { children: React.ReactNode }) {
    return (
        <MyThemeProvider>
            <HotkeysProvider
                defaultOptions={{
                    hotkey: { preventDefault: true },
                }}
            >
                <AlertDialogProvider>{children}</AlertDialogProvider>
                <Toaster position="top-center" />
            </HotkeysProvider>
        </MyThemeProvider>
    );
}
