import { isRecord } from './guards';

function readErrorMessage(error) {
    if (!isRecord(error) || typeof error.message !== 'string') {
        return '';
    }
    return error.message.trim();
}

export function errorMessage(error) {
    const message = readErrorMessage(error);
    if (message) {
        return message;
    }
    if (error instanceof Error && error.message.trim()) {
        return error.message;
    }
    return 'Something went wrong. Please try again.';
}
export function createId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `id-${Date.now()}`;
}
