import { createContext, useContext, useEffect, useMemo } from 'react';
import {
    authSessionCleared,
    login as loginRequest,
    logout as logoutRequest,
    selectAuthState,
} from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { readSession } from '../utilities/session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const dispatch = useAppDispatch();
    const session = useAppSelector((state) => selectAuthState(state).session);

    useEffect(() => {
        if (!session) {
            return;
        }
        // Drop Redux auth when sessionStorage was cleared or the JWT expired.
        if (!readSession()) {
            dispatch(authSessionCleared());
        }
    }, [dispatch, session]);

    const value = useMemo(
        () => ({
            session,
            login(request) {
                return dispatch(loginRequest(request)).unwrap();
            },
            logout() {
                return dispatch(logoutRequest()).unwrap();
            },
        }),
        [dispatch, session],
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error('useAuth must be used within AuthProvider.');
    }
    return value;
}
