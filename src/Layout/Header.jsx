import logoUrl from '../Assets/images/acme-logo.svg';
import { MenuIcon } from '../Common/components/Icons';
import { apiConfig } from '../Api_Config/apiConfig';
import { useAuth } from '../Context/AuthContext';
import { GlobalSearch } from './GlobalSearch';
import { NotificationMenu } from './NotificationMenu';
import { ProfileMenu } from './ProfileMenu';
import { ThemeSwitcher } from '../Common/components/ThemeSwitcher';

export function Header({ sidebarOpen, onToggleSidebar }) {
    const { session } = useAuth();
    return (
        <header className="topbar">
            <div className="brand-accent" />
            <a className="skip-link" href="#main">Skip to content</a>
            <div className="topbar-row">
                <button type="button" className="icon-button" aria-label={sidebarOpen ? 'Collapse menu' : 'Expand menu'} aria-expanded={sidebarOpen} onClick={onToggleSidebar}>
                    <MenuIcon />
                </button>
                <img className="topbar-logo" src={logoUrl} alt="ACME" />
                {session ? (
                    <div className="office-context">
                        <span>Head office <strong>{session.headOfficeName}</strong></span>
                        <span>Branch <strong>{session.branchOfficeName}</strong></span>
                    </div>
                ) : null}
                <GlobalSearch />
                <div className="topbar-actions">
                    <span className="mode-badge">{apiConfig.dataMode === 'api' ? 'API mode' : 'Demonstration'}</span>
                    <NotificationMenu />
                    <ThemeSwitcher labelled={false} />
                    <ProfileMenu />
                </div>
            </div>
        </header>
    );
}
