/**
 * Brand colors taken from the ACME logo asset.
 * Symbol cyan is #00ACD2 and the wordmark charcoal is #323231.
 * Button text on cyan is charcoal so the label stays readable.
 */
export const colors = {
    primary: '#00ACD2',
    primaryHover: '#0098BA',
    primarySoft: '#E5F6FB',
    onPrimary: '#1A1A1A',
    header: '#205D75',
    charcoal: '#333333',
    wordmark: '#323231',
    body: '#4E4E4E',
    white: '#FFFFFF',
    background: '#F5F7F9',
    border: '#E2E6EA',
    text: '#222222',
    success: '#1F7A4D',
    successSoft: '#E7F6EE',
    error: '#B42318',
    errorSoft: '#FDECEC',
    focus: '#205D75',
    overlay: 'rgba(34, 34, 34, 0.35)',
};
export const cssVariables = {
    '--color-primary': colors.primary,
    '--color-primary-hover': colors.primaryHover,
    '--color-primary-soft': colors.primarySoft,
    '--color-on-primary': colors.onPrimary,
    '--color-header': colors.header,
    '--color-charcoal': colors.charcoal,
    '--color-wordmark': colors.wordmark,
    '--color-body': colors.body,
    '--color-white': colors.white,
    '--color-background': colors.background,
    '--color-border': colors.border,
    '--color-text': colors.text,
    '--color-success': colors.success,
    '--color-success-soft': colors.successSoft,
    '--color-error': colors.error,
    '--color-error-soft': colors.errorSoft,
    '--color-focus': colors.focus,
    '--color-overlay': colors.overlay,
};
