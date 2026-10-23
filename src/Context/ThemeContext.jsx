import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { applyTheme, readStoredTheme, resolveTheme, themeStorageKey } from '../Common/theme/applyTheme';
import { useMediaQuery } from '../Hooks/useMediaQuery';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [mode, setMode] = useState(readStoredTheme);
    const systemDark = useMediaQuery('(prefers-color-scheme: dark)');
    const resolved = resolveTheme(mode, systemDark);

    useEffect(() => {
        applyTheme(mode);
        try {
            localStorage.setItem(themeStorageKey, mode);
        }
        catch {
            // Theme still applies for this visit when storage is unavailable.
        }
    }, [mode, resolved]);

    const value = useMemo(() => ({ mode, resolved, setMode }), [mode, resolved]);
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const value = useContext(ThemeContext);
    if (!value) {
        throw new Error('useTheme must be used within ThemeProvider.');
    }
    return value;
}
