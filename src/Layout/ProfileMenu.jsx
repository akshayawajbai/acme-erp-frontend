import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Common/components/Button';
import { appRoutes } from '../constants/routes';
import { useAuth } from '../Context/AuthContext';
import { useDismiss } from '../Hooks/useDismiss';
import { errorMessage } from '../utilities/errors';

function initials(name) {
    const parts = (name || 'User').trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0] || '').join('').toUpperCase() || 'U';
}

export function ProfileMenu() {
    const { session, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [logoutError, setLogoutError] = useState('');
    const [loggingOut, setLoggingOut] = useState(false);
    const containerRef = useRef(null);
    useDismiss(open, () => setOpen(false), containerRef);
    const name = session?.displayName ?? 'User';

    async function handleLogout() {
        setLoggingOut(true);
        setLogoutError('');
        try {
            await logout();
            navigate(appRoutes.login);
        }
        catch (error) {
            setLogoutError(errorMessage(error));
        }
        finally {
            setLoggingOut(false);
        }
    }

    return (
        <div className="menu-wrap" ref={containerRef}>
            <button type="button" className="profile-button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
                <span className="profile-avatar" aria-hidden="true">{initials(name)}</span>
                <span className="profile-name">{name}</span>
            </button>
            {open ? (
                <div className="menu-panel" role="menu">
                    <p className="profile-office">{session?.headOfficeName}</p>
                    <p className="profile-office">{session?.branchOfficeName}</p>
                    <button type="button" className="menu-item" role="menuitem" onClick={() => { setOpen(false); navigate(appRoutes.profile); }}>
                        Profile
                    </button>
                    <button type="button" className="menu-item" role="menuitem" onClick={() => { setOpen(false); navigate(appRoutes.preferences); }}>
                        Preferences
                    </button>
                    {logoutError ? <p className="field-error">{logoutError}</p> : null}
                    <Button variant="danger" size="small" loading={loggingOut} onClick={() => void handleLogout()}>
                        Log out
                    </Button>
                </div>
            ) : null}
        </div>
    );
}
