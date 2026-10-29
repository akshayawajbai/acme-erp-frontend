export const dashboardLayoutStorageKey = 'acme.dashboard.layout';

export const widgetSizeOptions = [
    { id: 'sm', label: 'Small' },
    { id: 'md', label: 'Medium' },
    { id: 'lg', label: 'Large' },
    { id: 'xl', label: 'Full width' },
];

/**
 * Stable widget identifiers only — never store component constructors or code.
 */
export const dashboardWidgetRegistry = [
    { id: 'totalIncome', label: 'Total Income', defaultSize: 'sm', defaultVisible: true },
    { id: 'totalExpenses', label: 'Total Expenses', defaultSize: 'sm', defaultVisible: true },
    { id: 'cashBalance', label: 'Cash Balance', defaultSize: 'sm', defaultVisible: true },
    { id: 'bankBalance', label: 'Bank Balance', defaultSize: 'sm', defaultVisible: true },
    { id: 'incomeExpenseTrend', label: 'Income vs expenses trend', defaultSize: 'lg', defaultVisible: true },
    { id: 'expenseBreakdown', label: 'Expense breakdown', defaultSize: 'md', defaultVisible: true },
    { id: 'cashFlowGauge', label: 'Net position', defaultSize: 'md', defaultVisible: true },
    { id: 'quickActions', label: 'Quick actions', defaultSize: 'md', defaultVisible: true },
    { id: 'recentVouchers', label: 'Recent vouchers', defaultSize: 'xl', defaultVisible: true },
    { id: 'recentTransactions', label: 'Recent transactions', defaultSize: 'xl', defaultVisible: true },
];

export function createDefaultDashboardLayout() {
    return dashboardWidgetRegistry.map((widget) => ({
        id: widget.id,
        visible: widget.defaultVisible,
        size: widget.defaultSize,
    }));
}

export function sanitizeDashboardLayout(input) {
    const defaults = createDefaultDashboardLayout();
    const source = Array.isArray(input) ? input : [];
    const byId = new Map();

    source.forEach((item) => {
        if (!item || typeof item !== 'object' || typeof item.id !== 'string') {
            return;
        }
        if (!dashboardWidgetRegistry.some((widget) => widget.id === item.id)) {
            return;
        }
        byId.set(item.id, {
            id: item.id,
            visible: item.visible !== false,
            size: widgetSizeOptions.some((option) => option.id === item.size) ? item.size : undefined,
        });
    });

    const ordered = [];
    source.forEach((item) => {
        if (!item || !byId.has(item.id) || ordered.some((entry) => entry.id === item.id)) {
            return;
        }
        const base = defaults.find((entry) => entry.id === item.id);
        const saved = byId.get(item.id);
        ordered.push({
            id: item.id,
            visible: saved.visible,
            size: saved.size || base.size,
        });
    });

    defaults.forEach((entry) => {
        if (ordered.some((item) => item.id === entry.id)) {
            return;
        }
        const saved = byId.get(entry.id);
        ordered.push(saved ? { ...entry, ...saved, size: saved.size || entry.size } : entry);
    });

    return ordered;
}

export function readStoredDashboardLayout() {
    try {
        const raw = localStorage.getItem(dashboardLayoutStorageKey);
        if (!raw) {
            return createDefaultDashboardLayout();
        }
        return sanitizeDashboardLayout(JSON.parse(raw));
    }
    catch {
        return createDefaultDashboardLayout();
    }
}

export function writeStoredDashboardLayout(layout) {
    try {
        localStorage.setItem(dashboardLayoutStorageKey, JSON.stringify(sanitizeDashboardLayout(layout)));
    }
    catch {
        // Layout still applies for this visit when storage is unavailable.
    }
}

export function clearStoredDashboardLayout() {
    try {
        localStorage.removeItem(dashboardLayoutStorageKey);
    }
    catch {
        // Ignore storage failures.
    }
}

export function getWidgetMeta(id) {
    return dashboardWidgetRegistry.find((widget) => widget.id === id) || null;
}
