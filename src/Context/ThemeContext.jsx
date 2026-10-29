import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
    applyAppearance,
    clearStoredAppearance,
    defaultAppearance,
    readStoredAppearance,
    sanitizeAppearance,
    writeStoredAppearance,
} from '../Common/theme/appearance';
import { applyTheme, readStoredTheme, resolveTheme, themeStorageKey } from '../Common/theme/applyTheme';
import { useMediaQuery } from '../Hooks/useMediaQuery';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [mode, setMode] = useState(readStoredTheme);
    const [appearance, setAppearanceState] = useState(readStoredAppearance);
    const systemDark = useMediaQuery('(prefers-color-scheme: dark)');
    const resolved = resolveTheme(mode, systemDark);

    useEffect(() => {
        applyTheme(mode, appearance);
        try {
            localStorage.setItem(themeStorageKey, mode);
        }
        catch {
            // Theme still applies for this visit when storage is unavailable.
        }
        writeStoredAppearance(appearance);
    }, [mode, resolved, appearance]);

    const setAppearance = useCallback((next) => {
        setAppearanceState(sanitizeAppearance(typeof next === 'function' ? next(appearance) : next));
    }, [appearance]);

    const updateAppearance = useCallback((partial) => {
        setAppearanceState((current) => sanitizeAppearance({ ...current, ...partial }));
    }, []);

    const resetAppearance = useCallback(() => {
        clearStoredAppearance();
        const defaults = sanitizeAppearance(defaultAppearance);
        setAppearanceState(defaults);
        applyAppearance(defaults);
    }, []);

    const previewAppearance = useCallback((partial) => {
        const next = sanitizeAppearance({ ...appearance, ...partial });
        applyAppearance(next);
        return next;
    }, [appearance]);

    const value = useMemo(() => ({
        mode,
        resolved,
        setMode,
        appearance,
        setAppearance,
        updateAppearance,
        resetAppearance,
        previewAppearance,
    }), [mode, resolved, appearance, setAppearance, updateAppearance, resetAppearance, previewAppearance]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const value = useContext(ThemeContext);
    if (!value) {
        throw new Error('useTheme must be used within ThemeProvider.');
    }
    return value;
}
