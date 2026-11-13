import { parseLocalIsoDate } from '../../../../utilities/dates';

export function requiredText(value, message) {
    if (typeof value !== 'string' || !value.trim()) {
        return message;
    }
    return '';
}

export function requiredSelect(value, message) {
    if (typeof value !== 'string' || !value.trim()) {
        return message;
    }
    return '';
}

export function optionalEmail(value) {
    const text = typeof value === 'string' ? value.trim() : '';
    if (!text) {
        return '';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
        return 'Enter a valid email address.';
    }
    return '';
}

export function requiredEmail(value) {
    const empty = requiredText(value, 'Enter an email address.');
    if (empty) {
        return empty;
    }
    return optionalEmail(value);
}

export function optionalPhone(value) {
    const text = typeof value === 'string' ? value.trim() : '';
    if (!text) {
        return '';
    }
    if (!/^[0-9+\-\s()]{7,18}$/.test(text)) {
        return 'Enter a valid phone number.';
    }
    const digits = text.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) {
        return 'Enter a valid phone number.';
    }
    return '';
}

export function requiredPhone(value, message = 'Enter a phone number.') {
    const empty = requiredText(value, message);
    if (empty) {
        return empty;
    }
    return optionalPhone(value);
}

export function optionalPan(value) {
    const text = typeof value === 'string' ? value.trim().toUpperCase() : '';
    if (!text) {
        return '';
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(text)) {
        return 'Enter a valid PAN (ABCDE1234F).';
    }
    return '';
}

export function optionalAadhaar(value) {
    const text = typeof value === 'string' ? value.replace(/\s/g, '') : '';
    if (!text) {
        return '';
    }
    if (!/^\d{12}$/.test(text)) {
        return 'Enter a valid 12-digit Aadhaar number.';
    }
    return '';
}

export function optionalIfsc(value) {
    const text = typeof value === 'string' ? value.trim().toUpperCase() : '';
    if (!text) {
        return '';
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(text)) {
        return 'Enter a valid IFSC (ABCD0123456).';
    }
    return '';
}

export function optionalAccountNumber(value) {
    const text = typeof value === 'string' ? value.trim() : '';
    if (!text) {
        return '';
    }
    if (!/^\d{9,18}$/.test(text)) {
        return 'Account number must be 9 to 18 digits.';
    }
    return '';
}

export function requiredDate(value, message = 'Select a date.') {
    if (!parseLocalIsoDate(value)) {
        return message;
    }
    return '';
}

export function optionalDate(value) {
    if (!value) {
        return '';
    }
    if (!parseLocalIsoDate(value)) {
        return 'Enter a valid date.';
    }
    return '';
}

export function dateOrder(startValue, endValue, message) {
    if (!startValue || !endValue) {
        return '';
    }
    const start = parseLocalIsoDate(startValue);
    const end = parseLocalIsoDate(endValue);
    if (!start || !end) {
        return '';
    }
    if (end < start) {
        return message;
    }
    return '';
}

export function collectErrors(checks) {
    const errors = {};
    Object.entries(checks).forEach(([key, message]) => {
        if (message) {
            errors[key] = message;
        }
    });
    return errors;
}
