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
    { id: 'quickActions', label: 'Quick actions', defaultSize: 'xl', defaultVisible: true },
    { id: 'recentVouchers', label: 'Recent vouchers', defaultSize: 'xl', defaultVisible: true },
    { id: 'recentTransactions', label: 'Recent transactions', defaultSize: 'xl', defaultVisible: true },
];

/** Sizes from the grouped statement dashboard. An untouched copy is upgraded once. */
const statementLayoutSizes = {
    totalIncome: 'md',
    totalExpenses: 'md',
    cashBalance: 'md',
    bankBalance: 'md',
    incomeExpenseTrend: 'xl',
    expenseBreakdown: 'md',
    cashFlowGauge: 'md',
    quickActions: 'xl',
    recentVouchers: 'xl',
    recentTransactions: 'xl',
};

/** Sizes from the previous equal-card dashboard. An untouched copy is upgraded once. */
const legacyEqualCardSizes = {
    totalIncome: 'sm',
    totalExpenses: 'sm',
    cashBalance: 'sm',
    bankBalance: 'sm',
    incomeExpenseTrend: 'lg',
    expenseBreakdown: 'md',
    cashFlowGauge: 'md',
    quickActions: 'md',
    recentVouchers: 'xl',
    recentTransactions: 'xl',
};

function matchesSizePreset(layout, sizes) {
    if (!Array.isArray(layout) || layout.length !== dashboardWidgetRegistry.length) {
        return false;
    }
    return layout.every((item, index) => {
        const widget = dashboardWidgetRegistry[index];
        return item.id === widget.id
            && item.visible !== false
            && item.size === sizes[widget.id];
    });
}

function isUntouchedEqualCardLayout(layout) {
    return matchesSizePreset(layout, legacyEqualCardSizes);
}

function isUntouchedStatementLayout(layout) {
    return matchesSizePreset(layout, statementLayoutSizes);
}

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
        const sanitized = sanitizeDashboardLayout(JSON.parse(raw));
        if (!isUntouchedEqualCardLayout(sanitized) && !isUntouchedStatementLayout(sanitized)) {
            return sanitized;
        }
        const next = createDefaultDashboardLayout();
        writeStoredDashboardLayout(next);
        return next;
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
