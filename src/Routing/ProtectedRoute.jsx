import { Navigate, Outlet } from 'react-router-dom';
import { appRoutes } from '../constants/routes';
import { useAuth } from '../Context/AuthContext';
export function ProtectedRoute() {
    const { session } = useAuth();
    if (!session) {
        return <Navigate to={appRoutes.login} replace/>;
    }
    return <Outlet />;
}
