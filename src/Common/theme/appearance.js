/**
 * Appearance preferences layered on top of light/dark theme tokens.
 * Invalid or incomplete stored values fall back to ACME defaults.
 */

export const appearanceStorageKey = 'acme.appearance';
export const appearanceVersion = 2;

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

/** ACME brand defaults: brown primary with black / grey / white support colors. */
export const defaultAppearance = {
    version: appearanceVersion,
    primaryColor: '#755321',
    accentColor: '#000000',
    backgroundColor: '',
    surfaceColor: '',
    sidebarBackground: '',
    sidebarText: '',
    sidebarActive: '',
    sidebarHover: '',
    chartPalette: ['#755321', '#4e4e4e', '#1f7a4d', '#c4a35a', '#b42318', '#8b6914'],
    cardBorderVisible: true,
    cardBorderColor: '',
    cardRadius: 10,
    cardShadow: 'soft',
    cardSpacing: 16,
    density: 'comfortable',
    fontScale: '100',
    sidebarBehavior: 'remember',
};

/** Legacy defaults from the previous cyan/teal theme (v1). */
const legacyDefaultAppearance = {
    primaryColor: '#00acd2',
    accentColor: '#205d75',
    chartPalette: ['#00acd2', '#205d75', '#1f7a4d', '#8a5a00', '#b42318', '#6aa8be'],
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
    const r = Math.min(255, Math.max(0, ((num >> 16) & 255) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 255) + amount));
    const b = Math.min(255, Math.max(0, (num & 255) + amount));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function softTint(hex, alpha) {
    const raw = hex.replace('#', '');
    const r = parseInt(raw.slice(0, 2), 16);
    const g = parseInt(raw.slice(2, 4), 16);
    const b = parseInt(raw.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function relativeLuminance(hex) {
    const raw = hex.replace('#', '');
    const channels = [0, 2, 4].map((offset) => {
        const channel = parseInt(raw.slice(offset, offset + 2), 16) / 255;
        return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function samePalette(left, right) {
    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
        return false;
    }
    return left.every((color, index) => normalizeHex(color, '') === normalizeHex(right[index], ''));
}

function isLegacyUncustomized(source) {
    if (!source || typeof source !== 'object') {
        return false;
    }
    const version = Number(source.version) || 1;
    if (version >= appearanceVersion) {
        return false;
    }
    const primary = normalizeHex(source.primaryColor, '');
    const accent = normalizeHex(source.accentColor, '');
    return (
        primary === legacyDefaultAppearance.primaryColor
        && accent === legacyDefaultAppearance.accentColor
        && (!Array.isArray(source.chartPalette) || samePalette(source.chartPalette, legacyDefaultAppearance.chartPalette))
    );
}

export function cloneDefaultAppearance() {
    return {
        ...defaultAppearance,
        chartPalette: [...defaultAppearance.chartPalette],
    };
}

export function sanitizeAppearance(input) {
    if (isLegacyUncustomized(input)) {
        return cloneDefaultAppearance();
    }

    const source = input && typeof input === 'object' ? input : {};
    const palette = Array.isArray(source.chartPalette)
        ? source.chartPalette.filter(isHex).map((color) => color.trim().toLowerCase()).slice(0, 8)
        : [];

    return {
        version: appearanceVersion,
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
            return cloneDefaultAppearance();
        }
        const parsed = JSON.parse(raw);
        const safe = sanitizeAppearance(parsed);
        if (isLegacyUncustomized(parsed) || Number(parsed?.version) !== appearanceVersion) {
            writeStoredAppearance(safe);
        }
        return safe;
    }
    catch {
        return cloneDefaultAppearance();
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
    const theme = root.dataset.theme === 'dark' ? 'dark' : 'light';
    const headerAccent = theme === 'dark' && relativeLuminance(accent) < 0.28
        ? lighten(accent, 168)
        : accent;
    const onPrimary = relativeLuminance(primary) < 0.45 ? '#ffffff' : '#000000';

    root.style.setProperty('--color-primary', primary);
    root.style.setProperty('--color-primary-hover', lighten(primary, theme === 'dark' ? 24 : -18));
    root.style.setProperty('--color-primary-soft', softTint(primary, theme === 'dark' ? 0.28 : 0.14));
    root.style.setProperty('--color-on-primary', onPrimary);
    root.style.setProperty('--color-accent', accent);
    root.style.setProperty('--color-header', headerAccent);
    root.style.setProperty('--color-brand-teal', primary);
    root.style.setProperty('--color-focus', headerAccent);
    root.style.setProperty('--color-contact-bar', primary);

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
