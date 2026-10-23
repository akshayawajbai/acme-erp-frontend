import { createContext, useContext, useMemo, useState } from 'react';
import { authService } from '../services/dataProvider';
import { clearSession, readSession, writeSession } from '../utilities/session';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [session, setSession] = useState(() => readSession());
    const value = useMemo(() => ({
        session,
        async login(request) {
            const nextSession = await authService.login(request);
            writeSession(nextSession);
            setSession(nextSession);
        },
        async logout() {
            await authService.logout();
            clearSession();
            setSession(null);
        },
    }), [session]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error('useAuth must be used within AuthProvider.');
    }
    return value;
}
