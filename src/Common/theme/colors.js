/**
 * Light-theme ACME palette.
 * CSS custom properties in src/index.css are the runtime source of truth.
 * Primary #00ACD2, white #FFFFFF, dark background #12171C, dark surface #1C242C.
 */
export const colors = {
    primary: '#00ACD2',
    primaryHover: '#009AC0',
    primarySoft: 'rgba(0, 172, 210, 0.14)',
    onPrimary: '#12171C',
    accent: '#00ACD2',
    header: '#12171C',
    charcoal: '#12171C',
    wordmark: '#12171C',
    body: '#3E4850',
    white: '#FFFFFF',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    darkBackground: '#12171C',
    darkSurface: '#1C242C',
    border: 'rgba(18, 23, 28, 0.12)',
    text: '#12171C',
    success: '#1F7A4D',
    successSoft: 'rgba(31, 122, 77, 0.12)',
    error: '#B42318',
    errorSoft: 'rgba(180, 35, 24, 0.12)',
    focus: '#00ACD2',
    overlay: 'rgba(18, 23, 28, 0.4)',
};

export const cssVariables = {
    '--color-primary': colors.primary,
    '--color-primary-hover': colors.primaryHover,
    '--color-primary-soft': colors.primarySoft,
    '--color-on-primary': colors.onPrimary,
    '--color-accent': colors.accent,
    '--color-header': colors.header,
    '--color-charcoal': colors.charcoal,
    '--color-wordmark': colors.wordmark,
    '--color-body': colors.body,
    '--color-white': colors.white,
    '--color-background': colors.background,
    '--color-surface': colors.surface,
    '--color-border': colors.border,
    '--color-text': colors.text,
    '--color-success': colors.success,
    '--color-success-soft': colors.successSoft,
    '--color-error': colors.error,
    '--color-error-soft': colors.errorSoft,
    '--color-focus': colors.focus,
    '--color-overlay': colors.overlay,
};
