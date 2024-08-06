import { SnackbarProvider } from 'notistack';
import { HashRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { useI18n } from './i18n';
import MyThemeProvider from './providers/ThemeProvider';

type Iprops = {
    children: React.ReactNode
}

export default function Imports(props: Iprops) {
    useI18n()

    return (
        <HashRouter>
            <RecoilRoot>
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
            </RecoilRoot>
        </HashRouter>
    );
}
