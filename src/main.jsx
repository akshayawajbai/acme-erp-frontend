import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { applyTheme } from './Common/theme/applyTheme';
import { AuthProvider } from './Context/AuthContext';
import { ThemeProvider } from './Context/ThemeContext';
import { ToastProvider } from './Context/ToastContext';
import './index.css';
applyTheme();
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element was not found.');
}
createRoot(rootElement).render(<StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>);
