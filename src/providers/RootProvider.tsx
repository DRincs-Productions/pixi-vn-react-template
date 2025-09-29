import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import MyThemeProvider from "./ThemeProvider";

export default function RootProvider({ children }: { children: React.ReactNode }) {
    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
}
