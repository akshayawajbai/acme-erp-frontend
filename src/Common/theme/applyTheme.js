export const themeStorageKey = 'acme.theme';

export const themeModes = [
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' },
    { id: 'system', label: 'System' },
];

export function readStoredTheme() {
    try {
        const stored = localStorage.getItem(themeStorageKey);
        return themeModes.some((mode) => mode.id === stored) ? stored : 'system';
    }
    catch {
        return 'system';
    }
}

export function resolveTheme(mode, systemDark) {
    if (mode === 'dark') {
        return 'dark';
    }
    if (mode === 'light') {
        return 'light';
    }
    return systemDark ? 'dark' : 'light';
}

export function applyTheme(mode = readStoredTheme()) {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = resolveTheme(mode, systemDark);
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themeMode = mode;
}
