import { HotkeysProvider } from "@tanstack/react-hotkeys";
import { AlertDialogProvider } from "./AlertDialogProvider";
import { NotificationProvider } from "./NotificationProvider";
import MyThemeProvider from "./ThemeProvider";

export default function RootProvider({ children }: { children: React.ReactNode }) {
    return (
        <MyThemeProvider>
            <NotificationProvider>
                <HotkeysProvider
                    defaultOptions={{
                        hotkey: { preventDefault: true },
                    }}
                >
                    <AlertDialogProvider>{children}</AlertDialogProvider>
                </HotkeysProvider>
            </NotificationProvider>
        </MyThemeProvider>
    );
}
