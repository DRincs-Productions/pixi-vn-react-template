import { SnackbarProvider } from "notistack";
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
                {children}
            </SnackbarProvider>
        </MyThemeProvider>
    );
}
