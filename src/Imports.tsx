import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';
import MyThemeProvider from './providers/ThemeProvider';

export default function Imports({ children }: {
    children: React.ReactNode
}) {
    const queryClient = new QueryClient()

    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <MyThemeProvider>
                    <SnackbarProvider
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        {children}
                    </SnackbarProvider>
                </MyThemeProvider>
            </QueryClientProvider>
        </BrowserRouter>
    );
}
