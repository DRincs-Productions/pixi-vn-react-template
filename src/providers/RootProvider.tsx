import { HotkeysProvider } from "@tanstack/react-hotkeys";
import { SnackbarProvider } from "notistack";
import { AlertDialogProvider } from "./AlertDialogProvider";
import MyThemeProvider from "./ThemeProvider";

export default function RootProvider({ children }: { children: React.ReactNode }) {
    return (
        <MyThemeProvider>
            <SnackbarProvider
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <HotkeysProvider
                    defaultOptions={{
                        hotkey: { preventDefault: true },
                    }}
                >
                    <AlertDialogProvider>{children}</AlertDialogProvider>
                </HotkeysProvider>
            </SnackbarProvider>
        </MyThemeProvider>
    );
}
