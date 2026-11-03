import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appRoutes } from '../constants/routes';
import { useAuth } from '../Context/AuthContext';
import { enqueueToast } from '../Context/toastQueue';
import { errorMessage } from '../utilities/errors';

const LOGOUT_SUCCESS_TOAST = {
    message: 'You have been logged out successfully.',
    tone: 'success',
};

export function useLogoutFlow() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const inFlightRef = useRef(false);

    const requestLogout = useCallback(() => {
        setError('');
        setConfirmOpen(true);
    }, []);

    const cancelLogout = useCallback(() => {
        if (!busy) {
            setConfirmOpen(false);
            setError('');
        }
    }, [busy]);

    const confirmLogout = useCallback(async () => {
        if (inFlightRef.current) {
            return;
        }
        inFlightRef.current = true;
        setBusy(true);
        setError('');
        try {
            await logout();
            // Persist only: logout unmounts the authenticated shell and can drop an
            // in-memory toast. LoginPage / ToastProvider flush this pending toast.
            enqueueToast(LOGOUT_SUCCESS_TOAST, { persistOnly: true });
            navigate(appRoutes.login, { replace: true });
        }
        catch (err) {
            setError(errorMessage(err));
            setBusy(false);
            inFlightRef.current = false;
            return;
        }
        inFlightRef.current = false;
    }, [logout, navigate]);

    return {
        confirmOpen,
        busy,
        error,
        requestLogout,
        cancelLogout,
        confirmLogout,
    };
}
