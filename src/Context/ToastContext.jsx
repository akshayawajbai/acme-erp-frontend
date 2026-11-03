import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    AlertCircleIcon,
    CheckCircleIcon,
    InfoCircleIcon,
    WarningTriangleIcon,
} from '../Common/components/Icons';
import { consumePendingToast, enqueueToast } from './toastQueue';

const ToastContext = createContext(null);
const DEFAULT_DURATION = 4500;

const toneMeta = {
    success: { title: 'Success', Icon: CheckCircleIcon },
    error: { title: 'Error', Icon: AlertCircleIcon },
    warning: { title: 'Warning', Icon: WarningTriangleIcon },
    info: { title: 'Notice', Icon: InfoCircleIcon },
};

function resolveTone(tone) {
    if (tone && toneMeta[tone]) {
        return tone;
    }
    return 'success';
}

function resolveDuration(toast) {
    if (toast?.persistent === true || toast?.duration === 0 || toast?.duration === Infinity) {
        return null;
    }
    if (typeof toast?.duration === 'number' && toast.duration > 0) {
        return toast.duration;
    }
    return DEFAULT_DURATION;
}

function ToastItem({ toast, onDismiss }) {
    const tone = resolveTone(toast.tone);
    const meta = toneMeta[tone];
    const Icon = meta.Icon;
    const duration = toast.duration;
    const showProgress = duration != null && duration > 0 && !toast.leaving;
    const [paused, setPaused] = useState(false);
    const remainingRef = useRef(duration);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!showProgress) {
            return undefined;
        }
        if (paused) {
            return undefined;
        }
        const startedAt = Date.now();
        const remaining = remainingRef.current;
        timerRef.current = window.setTimeout(() => {
            onDismiss(toast.id);
        }, remaining);
        return () => {
            window.clearTimeout(timerRef.current);
            remainingRef.current = Math.max(0, remaining - (Date.now() - startedAt));
        };
    }, [paused, showProgress, toast.id, onDismiss]);

    return (
        <div
            className={`toast toast-${tone}${toast.leaving ? ' is-leaving' : ''}${paused ? ' is-paused' : ''}`}
            role="status"
            style={showProgress ? { '--toast-duration': `${duration}ms` } : undefined}
            onMouseEnter={() => {
                if (showProgress) {
                    setPaused(true);
                }
            }}
            onMouseLeave={() => {
                if (showProgress) {
                    setPaused(false);
                }
            }}
        >
            <span className="toast-icon" aria-hidden="true">
                <Icon />
            </span>
            <div className="toast-body">
                <p className="toast-title">{toast.title}</p>
                <p>{toast.message}</p>
            </div>
            <button
                type="button"
                className="toast-close"
                aria-label="Dismiss notification"
                onClick={() => onDismiss(toast.id)}
            >
                ×
            </button>
            {showProgress ? (
                <span className="toast-progress" aria-hidden="true">
                    <span className="toast-progress__bar" />
                </span>
            ) : null}
        </div>
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismissToast = useCallback((id) => {
        setToasts((current) => current.map((toast) => (
            toast.id === id ? { ...toast, leaving: true } : toast
        )));
        window.setTimeout(() => {
            setToasts((current) => current.filter((toast) => toast.id !== id));
        }, 180);
    }, []);

    const pushToast = useCallback((toast) => {
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const tone = resolveTone(toast?.tone);
        const duration = resolveDuration(toast);
        const next = {
            id,
            tone,
            title: toast?.title || toneMeta[tone].title,
            message: toast?.message || '',
            duration,
            leaving: false,
        };
        setToasts((current) => [...current, next]);
        return id;
    }, []);

    useEffect(() => {
        window.__acmePushToast = pushToast;
        const pending = consumePendingToast();
        if (pending) {
            pushToast(pending);
        }
        return () => {
            if (window.__acmePushToast === pushToast) {
                delete window.__acmePushToast;
            }
        };
    }, [pushToast]);

    const value = useMemo(() => ({ pushToast, enqueueToast }), [pushToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="toast-stack" aria-live="polite" aria-relevant="additions text">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const value = useContext(ToastContext);
    if (!value) {
        throw new Error('useToast must be used within ToastProvider.');
    }
    return value;
}
