import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { useI18n } from './i18n';
import MyThemeProvider from './providers/ThemeProvider';

type Iprops = {
    children: React.ReactNode
}

export default function Imports(props: Iprops) {
    useI18n()
    const queryClient = new QueryClient()

    return (
        <BrowserRouter>
            <RecoilRoot>
                <QueryClientProvider client={queryClient}>
                    <MyThemeProvider>
                        <SnackbarProvider
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            {props.children}
                        </SnackbarProvider>
                    </MyThemeProvider>
                </QueryClientProvider>
            </RecoilRoot>
        </BrowserRouter>
    );
}
