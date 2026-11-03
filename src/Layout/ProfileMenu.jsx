import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Common/components/Button';
import { appRoutes } from '../constants/routes';
import { useAuth } from '../Context/AuthContext';
import { useDismiss } from '../Hooks/useDismiss';
import { useLogoutFlow } from '../Hooks/useLogoutFlow';
import { LogoutConfirm } from './LogoutConfirm';

function initials(name) {
    const parts = (name || 'User').trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0] || '').join('').toUpperCase() || 'U';
}

export function ProfileMenu() {
    const { session } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const {
        confirmOpen,
        busy,
        error,
        requestLogout,
        cancelLogout,
        confirmLogout,
    } = useLogoutFlow();
    useDismiss(open, () => setOpen(false), containerRef);
    const name = session?.displayName ?? 'User';

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
                    <Button
                        variant="danger"
                        size="small"
                        onClick={() => {
                            setOpen(false);
                            requestLogout();
                        }}
                    >
                        Log out
                    </Button>
                </div>
            ) : null}
            <LogoutConfirm
                open={confirmOpen}
                busy={busy}
                error={error}
                onCancel={cancelLogout}
                onConfirm={confirmLogout}
            />
        </div>
    );
}
