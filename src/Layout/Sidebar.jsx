import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logoUrl from '../Assets/images/acme-logo.svg';
import { navigationIcons } from '../Common/components/Icons';
import { ChevronIcon } from '../Common/components/Icons';
import { appRoutes, financeNavigation } from '../constants/routes';
import { useLogoutFlow } from '../Hooks/useLogoutFlow';
import { LogoutConfirm } from './LogoutConfirm';

function navClass({ isActive }) {
    return isActive ? 'nav-link active' : 'nav-link';
}

function NavItem({ item, collapsed, onNavigate }) {
    const Icon = navigationIcons[item.icon];
    return (
        <NavLink to={item.path} end className={navClass} data-label={item.label} title={collapsed ? item.label : undefined} onClick={onNavigate}>
            {Icon ? <Icon /> : null}
            <span className="nav-label">{item.label}</span>
        </NavLink>
    );
}

export function Sidebar({ collapsed, mobileOpen, onNavigate }) {
    const location = useLocation();
    const financeActive = location.pathname.startsWith('/finance');
    const [financeOpen, setFinanceOpen] = useState(financeActive);
    const {
        confirmOpen,
        busy,
        error,
        requestLogout,
        cancelLogout,
        confirmLogout,
    } = useLogoutFlow();

    useEffect(() => {
        if (financeActive) {
            setFinanceOpen(true);
        }
    }, [financeActive]);

    const rail = collapsed && !mobileOpen;
    const className = [
        'sidebar',
        rail ? 'is-collapsed' : '',
        mobileOpen ? 'is-drawer-open' : '',
    ].filter(Boolean).join(' ');
    const LogoutIcon = navigationIcons.logout;

    return (
        <aside className={className} aria-label="Main">
            <div className="sidebar-brand">
                <img src={logoUrl} alt="" />
                <span className="nav-label sidebar-brand-copy">
                    <span className="sidebar-brand-name">ACME</span>
                    <span className="sidebar-brand-line">Finance operations</span>
                </span>
            </div>
            <nav className="side-nav">
                <p className="nav-section">Workspace</p>
                <NavItem item={{ label: 'Dashboard', path: appRoutes.dashboard, icon: 'dashboard' }} collapsed={rail} onNavigate={onNavigate} />
                <div className={financeOpen ? 'nav-group-wrap is-open' : 'nav-group-wrap'}>
                    <button
                        type="button"
                        className={financeActive ? 'nav-group is-current' : 'nav-group'}
                        aria-expanded={financeOpen}
                        data-label="Finance"
                        title={rail ? 'Finance' : undefined}
                        onClick={() => setFinanceOpen((current) => !current)}
                    >
                        <span className="nav-group-main">
                            <navigationIcons.finance />
                            <span className="nav-label">Finance</span>
                        </span>
                        <ChevronIcon expanded={financeOpen} />
                    </button>
                    {financeOpen ? (
                        <div className="nav-children">
                            {financeNavigation.map((item) => (
                                <NavItem key={item.path} item={item} collapsed={false} onNavigate={onNavigate} />
                            ))}
                        </div>
                    ) : null}
                </div>
                <p className="nav-section">Account</p>
                <NavItem item={{ label: 'Preferences', path: appRoutes.preferences, icon: 'settings' }} collapsed={rail} onNavigate={onNavigate} />
            </nav>
            <div className="sidebar-footer">
                <button
                    type="button"
                    className="nav-link sidebar-logout"
                    data-label="Logout"
                    title={rail ? 'Logout' : undefined}
                    onClick={() => {
                        requestLogout();
                    }}
                >
                    {LogoutIcon ? <LogoutIcon /> : null}
                    <span className="nav-label">Logout</span>
                </button>
                {mobileOpen ? (
                    <button type="button" className="btn btn-outline btn-small drawer-close" onClick={onNavigate}>
                        Close menu
                    </button>
                ) : null}
            </div>
            <LogoutConfirm
                open={confirmOpen}
                busy={busy}
                error={error}
                onCancel={cancelLogout}
                onConfirm={confirmLogout}
            />
        </aside>
    );
}
