import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useMediaQuery } from '../Hooks/useMediaQuery';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const sidebarStorageKey = 'acme.sidebar';

export function AppLayout() {
    const compact = useMediaQuery('(max-width: 860px)');
    const [collapsed, setCollapsed] = useState(() => localStorage.getItem(sidebarStorageKey) === 'collapsed');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const location = useLocation();
    const sidebarOpen = compact ? drawerOpen : !collapsed;

    useEffect(() => {
        if (compact) {
            setDrawerOpen(false);
        }
    }, [location.pathname, compact]);

    function toggleSidebar() {
        if (compact) {
            setDrawerOpen((open) => !open);
            return;
        }
        setCollapsed((current) => {
            const next = !current;
            localStorage.setItem(sidebarStorageKey, next ? 'collapsed' : 'expanded');
            return next;
        });
    }

    return (
        <div className={collapsed && !compact ? 'app-shell sidebar-collapsed' : 'app-shell'}>
            <Header sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
            <div className="app-body">
                {compact && drawerOpen ? (
                    <button type="button" className="sidebar-backdrop" aria-label="Close menu" onClick={() => setDrawerOpen(false)} />
                ) : null}
                <Sidebar collapsed={!compact && collapsed} mobileOpen={compact && drawerOpen} onNavigate={() => setDrawerOpen(false)} />
                <main id="main" className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
