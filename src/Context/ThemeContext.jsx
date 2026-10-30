import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
    applyAppearance,
    clearStoredAppearance,
    cloneDefaultAppearance,
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
    const previewActiveRef = useRef(false);
    const previewValuesRef = useRef(null);
    const systemDark = useMediaQuery('(prefers-color-scheme: dark)');
    const resolved = resolveTheme(mode, systemDark);

    useEffect(() => {
        if (previewActiveRef.current && previewValuesRef.current) {
            // Keep unsaved live preview colors until save, reset, or explicit discard.
            document.documentElement.dataset.theme = resolved;
            document.documentElement.dataset.themeMode = mode;
            applyAppearance(previewValuesRef.current);
            try {
                localStorage.setItem(themeStorageKey, mode);
            }
            catch {
                // Theme mode still applies for this visit when storage is unavailable.
            }
            return;
        }

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
        previewActiveRef.current = false;
        previewValuesRef.current = null;
        setAppearanceState(sanitizeAppearance(typeof next === 'function' ? next(appearance) : next));
    }, [appearance]);

    const updateAppearance = useCallback((partial) => {
        previewActiveRef.current = false;
        previewValuesRef.current = null;
        setAppearanceState((current) => sanitizeAppearance({ ...current, ...partial }));
    }, []);

    const resetAppearance = useCallback(() => {
        previewActiveRef.current = false;
        previewValuesRef.current = null;
        clearStoredAppearance();
        const defaults = cloneDefaultAppearance();
        setAppearanceState(defaults);
        applyAppearance(defaults);
        writeStoredAppearance(defaults);
    }, []);

    const previewAppearance = useCallback((partial) => {
        const next = sanitizeAppearance({ ...appearance, ...partial });
        previewActiveRef.current = true;
        previewValuesRef.current = next;
        applyAppearance(next);
        return next;
    }, [appearance]);

    const discardPreview = useCallback(() => {
        if (!previewActiveRef.current) {
            return;
        }
        previewActiveRef.current = false;
        previewValuesRef.current = null;
        applyAppearance(appearance);
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
        discardPreview,
    }), [mode, resolved, appearance, setAppearance, updateAppearance, resetAppearance, previewAppearance, discardPreview]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const value = useContext(ThemeContext);
    if (!value) {
        throw new Error('useTheme must be used within ThemeProvider.');
    }
    return value;
}
