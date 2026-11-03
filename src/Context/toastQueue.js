export const PENDING_TOAST_KEY = 'acme.pendingToast';

export function enqueueToast(toast, options = {}) {
    if (!toast || typeof toast !== 'object') {
        return;
    }
    const persistOnly = options.persistOnly === true;
    try {
        sessionStorage.setItem(PENDING_TOAST_KEY, JSON.stringify(toast));
    }
    catch {
        // Storage may be unavailable; continue with the live deliverer when present.
    }
    if (persistOnly) {
        return;
    }
    if (typeof window !== 'undefined' && typeof window.__acmePushToast === 'function') {
        window.__acmePushToast(toast);
        try {
            sessionStorage.removeItem(PENDING_TOAST_KEY);
        }
        catch {
            // Ignore storage failures after a successful live delivery.
        }
    }
}

export function consumePendingToast() {
    try {
        const raw = sessionStorage.getItem(PENDING_TOAST_KEY);
        if (!raw) {
            return null;
        }
        sessionStorage.removeItem(PENDING_TOAST_KEY);
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
