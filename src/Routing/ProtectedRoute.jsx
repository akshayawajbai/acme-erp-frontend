import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { appRoutes } from '../constants/routes';
import { useAuth } from '../Context/AuthContext';
import { isPasswordChangeRequired } from '../utilities/session';

export function ProtectedRoute() {
    const { session } = useAuth();
    const location = useLocation();

    if (!session) {
        return <Navigate to={appRoutes.login} replace />;
    }

    if (isPasswordChangeRequired(session)) {
        if (location.pathname === appRoutes.passwordChangeRequired) {
            return <Outlet />;
        }
        return <Navigate to={appRoutes.passwordChangeRequired} replace />;
    }

    return <Outlet />;
}
