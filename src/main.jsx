import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { setAuthorizationHeaderProvider } from './Api_Config/httpClient';
import { applyTheme } from './Common/theme/applyTheme';
import { AuthProvider } from './Context/AuthContext';
import { ThemeProvider } from './Context/ThemeContext';
import { ToastProvider } from './Context/ToastContext';
import { store } from './store/store';
import { getAuthorizationHeader } from './utilities/session';
import './tailwind.css';
import './index.css';

applyTheme();

// Register once. The provider reads the current sessionStorage token on each request.
setAuthorizationHeaderProvider(getAuthorizationHeader);

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element was not found.');
}
createRoot(rootElement).render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider>
                <ToastProvider>
                    <AuthProvider>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </AuthProvider>
                </ToastProvider>
            </ThemeProvider>
        </Provider>
    </StrictMode>,
);
