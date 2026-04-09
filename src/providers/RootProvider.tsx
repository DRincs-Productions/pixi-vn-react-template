import { HotkeysProvider } from "@tanstack/react-hotkeys";
import { SnackbarProvider } from "notistack";
import { ConfirmDialogProvider } from "./ConfirmDialogProvider";
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
                    <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
                </HotkeysProvider>
            </SnackbarProvider>
        </MyThemeProvider>
    );
}
