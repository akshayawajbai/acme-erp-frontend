export function maskPan(value) {
    const text = typeof value === 'string' ? value.trim().toUpperCase() : '';
    if (!text) {
        return '—';
    }
    if (text.length < 4) {
        return '••••';
    }
    return `${'•'.repeat(Math.max(text.length - 4, 4))}${text.slice(-4)}`;
}

export function maskAadhaar(value) {
    const digits = typeof value === 'string' ? value.replace(/\D/g, '') : '';
    if (!digits) {
        return '—';
    }
    if (digits.length < 4) {
        return 'XXXX';
    }
    return `XXXX XXXX ${digits.slice(-4)}`;
}
