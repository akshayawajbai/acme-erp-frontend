export function errorMessage(error) {
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
