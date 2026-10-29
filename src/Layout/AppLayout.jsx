import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../Context/ThemeContext';
import { useMediaQuery } from '../Hooks/useMediaQuery';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const sidebarStorageKey = 'acme.sidebar';

function initialCollapsed(behavior) {
    if (behavior === 'expanded') {
        return false;
    }
    if (behavior === 'collapsed') {
        return true;
    }
    return localStorage.getItem(sidebarStorageKey) === 'collapsed';
}

export function AppLayout() {
    const compact = useMediaQuery('(max-width: 860px)');
    const { appearance } = useTheme();
    const [collapsed, setCollapsed] = useState(() => initialCollapsed(appearance.sidebarBehavior));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const location = useLocation();
    const sidebarOpen = compact ? drawerOpen : !collapsed;

    useEffect(() => {
        if (appearance.sidebarBehavior === 'expanded') {
            setCollapsed(false);
            return;
        }
        if (appearance.sidebarBehavior === 'collapsed') {
            setCollapsed(true);
        }
    }, [appearance.sidebarBehavior]);

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
            if (appearance.sidebarBehavior === 'remember') {
                localStorage.setItem(sidebarStorageKey, next ? 'collapsed' : 'expanded');
            }
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
