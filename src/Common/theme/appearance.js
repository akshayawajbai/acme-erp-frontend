/**
 * Appearance preferences layered on top of light/dark theme tokens.
 * Invalid or incomplete stored values fall back to ACME defaults.
 */

export const appearanceStorageKey = 'acme.appearance';

export const densityOptions = [
    { id: 'comfortable', label: 'Comfortable' },
    { id: 'compact', label: 'Compact' },
];

export const shadowOptions = [
    { id: 'none', label: 'None' },
    { id: 'soft', label: 'Soft' },
    { id: 'medium', label: 'Medium' },
];

export const fontScaleOptions = [
    { id: '95', label: 'Slightly smaller' },
    { id: '100', label: 'Default' },
    { id: '110', label: 'Slightly larger' },
];

export const sidebarBehaviorOptions = [
    { id: 'remember', label: 'Remember last state' },
    { id: 'expanded', label: 'Prefer expanded' },
    { id: 'collapsed', label: 'Prefer collapsed' },
];

export const defaultAppearance = {
    primaryColor: '#00acd2',
    accentColor: '#205d75',
    backgroundColor: '',
    surfaceColor: '',
    sidebarBackground: '',
    sidebarText: '',
    sidebarActive: '',
    sidebarHover: '',
    chartPalette: ['#00acd2', '#205d75', '#1f7a4d', '#8a5a00', '#b42318', '#6aa8be'],
    cardBorderVisible: true,
    cardBorderColor: '',
    cardRadius: 10,
    cardShadow: 'soft',
    cardSpacing: 16,
    density: 'comfortable',
    fontScale: '100',
    sidebarBehavior: 'remember',
};

const HEX = /^#([0-9a-fA-F]{6})$/;

function isHex(value) {
    return typeof value === 'string' && HEX.test(value.trim());
}

function normalizeHex(value, fallback) {
    if (!isHex(value)) {
        return fallback;
    }
    return value.trim().toLowerCase();
}

function optionalHex(value) {
    if (value === '' || value == null) {
        return '';
    }
    return isHex(value) ? value.trim().toLowerCase() : '';
}

function clampInt(value, min, max, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) {
        return fallback;
    }
    return Math.min(max, Math.max(min, Math.round(number)));
}

function shadowCss(level) {
    if (level === 'none') {
        return 'none';
    }
    if (level === 'medium') {
        return '0 4px 14px rgba(18, 23, 28, 0.12)';
    }
    return '0 1px 3px rgba(18, 23, 28, 0.06)';
}

function lighten(hex, amount) {
    const raw = hex.replace('#', '');
    const num = parseInt(raw, 16);
    const r = Math.min(255, ((num >> 16) & 255) + amount);
    const g = Math.min(255, ((num >> 8) & 255) + amount);
    const b = Math.min(255, (num & 255) + amount);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function softTint(hex, alpha) {
    const raw = hex.replace('#', '');
    const r = parseInt(raw.slice(0, 2), 16);
    const g = parseInt(raw.slice(2, 4), 16);
    const b = parseInt(raw.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function sanitizeAppearance(input) {
    const source = input && typeof input === 'object' ? input : {};
    const palette = Array.isArray(source.chartPalette)
        ? source.chartPalette.filter(isHex).map((color) => color.trim().toLowerCase()).slice(0, 8)
        : [];

    return {
        primaryColor: normalizeHex(source.primaryColor, defaultAppearance.primaryColor),
        accentColor: normalizeHex(source.accentColor, defaultAppearance.accentColor),
        backgroundColor: optionalHex(source.backgroundColor),
        surfaceColor: optionalHex(source.surfaceColor),
        sidebarBackground: optionalHex(source.sidebarBackground),
        sidebarText: optionalHex(source.sidebarText),
        sidebarActive: optionalHex(source.sidebarActive),
        sidebarHover: optionalHex(source.sidebarHover),
        chartPalette: palette.length >= 2 ? palette : [...defaultAppearance.chartPalette],
        cardBorderVisible: source.cardBorderVisible !== false,
        cardBorderColor: optionalHex(source.cardBorderColor),
        cardRadius: clampInt(source.cardRadius, 0, 24, defaultAppearance.cardRadius),
        cardShadow: shadowOptions.some((item) => item.id === source.cardShadow)
            ? source.cardShadow
            : defaultAppearance.cardShadow,
        cardSpacing: clampInt(source.cardSpacing, 8, 32, defaultAppearance.cardSpacing),
        density: densityOptions.some((item) => item.id === source.density)
            ? source.density
            : defaultAppearance.density,
        fontScale: fontScaleOptions.some((item) => item.id === source.fontScale)
            ? source.fontScale
            : defaultAppearance.fontScale,
        sidebarBehavior: sidebarBehaviorOptions.some((item) => item.id === source.sidebarBehavior)
            ? source.sidebarBehavior
            : defaultAppearance.sidebarBehavior,
    };
}

export function readStoredAppearance() {
    try {
        const raw = localStorage.getItem(appearanceStorageKey);
        if (!raw) {
            return { ...defaultAppearance, chartPalette: [...defaultAppearance.chartPalette] };
        }
        return sanitizeAppearance(JSON.parse(raw));
    }
    catch {
        return { ...defaultAppearance, chartPalette: [...defaultAppearance.chartPalette] };
    }
}

export function writeStoredAppearance(appearance) {
    try {
        localStorage.setItem(appearanceStorageKey, JSON.stringify(sanitizeAppearance(appearance)));
    }
    catch {
        // Preferences still apply for the current visit when storage is unavailable.
    }
}

export function clearStoredAppearance() {
    try {
        localStorage.removeItem(appearanceStorageKey);
    }
    catch {
        // Ignore storage failures.
    }
}

/**
 * Writes appearance overrides onto the document element.
 * Empty optional colors clear the inline override so theme CSS takes over.
 */
export function applyAppearance(appearance = readStoredAppearance()) {
    const safe = sanitizeAppearance(appearance);
    const root = document.documentElement;
    const primary = safe.primaryColor;
    const accent = safe.accentColor;

    root.style.setProperty('--color-primary', primary);
    root.style.setProperty('--color-primary-hover', lighten(primary, -18));
    root.style.setProperty('--color-primary-soft', softTint(primary, 0.16));
    root.style.setProperty('--color-accent', accent);
    root.style.setProperty('--color-header', accent);
    root.style.setProperty('--color-brand-teal', accent);
    root.style.setProperty('--color-focus', accent);
    root.style.setProperty('--color-contact-bar', accent);

    setOptional(root, '--color-background', safe.backgroundColor);
    setOptional(root, '--color-surface', safe.surfaceColor);
    setOptional(root, '--color-sidebar-bg', safe.sidebarBackground);
    setOptional(root, '--color-sidebar-text', safe.sidebarText);
    setOptional(root, '--color-sidebar-active', safe.sidebarActive);
    setOptional(root, '--color-sidebar-hover', safe.sidebarHover);
    setOptional(root, '--card-border-color', safe.cardBorderColor);

    root.style.setProperty('--card-radius', `${safe.cardRadius}px`);
    root.style.setProperty('--card-shadow', shadowCss(safe.cardShadow));
    root.style.setProperty('--card-gap', `${safe.cardSpacing}px`);
    root.style.setProperty('--card-border-width', safe.cardBorderVisible ? '1px' : '0');
    root.style.setProperty('--font-scale', String(Number(safe.fontScale) / 100));
    root.dataset.density = safe.density;

    safe.chartPalette.forEach((color, index) => {
        root.style.setProperty(`--chart-${index + 1}`, color);
    });

    return safe;
}

function setOptional(root, name, value) {
    if (value) {
        root.style.setProperty(name, value);
        return;
    }
    root.style.removeProperty(name);
}
