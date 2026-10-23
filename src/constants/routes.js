export const appRoutes = {
    login: '/login',
    dashboard: '/dashboard',
    chartOfAccounts: '/finance/chart-of-accounts',
    ledger: '/finance/ledger',
    ledgerGroup: '/finance/ledger-group',
    receiptVoucher: '/finance/receipt-voucher',
    paymentVoucher: '/finance/payment-voucher',
    journalVoucher: '/finance/journal-voucher',
    reports: '/finance/reports',
    profile: '/profile',
    preferences: '/preferences',
};
export const financeNavigation = [
    { label: 'Chart of Accounts', path: appRoutes.chartOfAccounts, icon: 'accounts' },
    { label: 'Ledger', path: appRoutes.ledger, icon: 'ledger' },
    { label: 'Ledger Group', path: appRoutes.ledgerGroup, icon: 'group' },
    { label: 'Receipt Voucher', path: appRoutes.receiptVoucher, icon: 'receipt' },
    { label: 'Payment Voucher', path: appRoutes.paymentVoucher, icon: 'payment' },
    { label: 'Journal Voucher', path: appRoutes.journalVoucher, icon: 'journal' },
    { label: 'Reports', path: appRoutes.reports, icon: 'reports' },
];
export function searchableNavigation() {
    return [
        { label: 'Dashboard', path: appRoutes.dashboard, group: 'Main' },
        ...financeNavigation.map((item) => ({ label: item.label, path: item.path, group: 'Finance' })),
        { label: 'Profile', path: appRoutes.profile, group: 'Account' },
        { label: 'Preferences', path: appRoutes.preferences, group: 'Account' },
    ];
}
