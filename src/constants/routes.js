export const appRoutes = {
    login: '/login',
    passwordChangeRequired: '/password-change-required',
    dashboard: '/dashboard',
    chartOfAccounts: '/finance/chart-of-accounts',
    ledger: '/finance/ledger',
    ledgerGroup: '/finance/ledger-group',
    receiptVoucher: '/finance/receipt-voucher',
    paymentVoucher: '/finance/payment-voucher',
    journalVoucher: '/finance/journal-voucher',
    financeReportsLegacy: '/finance/reports',
    mastersBranchOffice: '/finance/masters/branch-office',
    mastersSociety: '/finance/masters/society',
    mastersLocation: '/finance/masters/location',
    mastersProjectCategory: '/finance/masters/project-category',
    mastersProject: '/finance/masters/project',
    mastersProjectMap: '/finance/masters/project-map',
    mastersBankAccount: '/finance/masters/bank-account',
    mastersLedgerGroup: '/finance/masters/ledger-group',
    mastersLedger: '/finance/masters/ledger',
    mastersLedgerMap: '/finance/masters/ledger-map',
    mastersGoverningBodies: '/finance/masters/governing-bodies',
    fixedAssets: '/fixed-assets',
    payroll: '/payroll',
    reports: '/reports',
    utilities: '/utilities',
    profile: '/profile',
    preferences: '/preferences',
};

/** Finance → Masters (shown first under Finance) */
export const financeMastersNavigation = [
    { label: 'Branch Office', path: appRoutes.mastersBranchOffice, icon: 'accounts' },
    { label: 'Masters (Society)', path: appRoutes.mastersSociety, icon: 'group' },
    { label: 'Location', path: appRoutes.mastersLocation, icon: 'reports' },
    { label: 'Project Category', path: appRoutes.mastersProjectCategory, icon: 'journal' },
    { label: 'Project', path: appRoutes.mastersProject, icon: 'ledger' },
    { label: 'Project Map', path: appRoutes.mastersProjectMap, icon: 'accounts' },
    { label: 'Bank Account', path: appRoutes.mastersBankAccount, icon: 'payment' },
    { label: 'Ledger Group', path: appRoutes.mastersLedgerGroup, icon: 'group' },
    { label: 'Master (Ledger)', path: appRoutes.mastersLedger, icon: 'ledger' },
    { label: 'Master Ledger Map', path: appRoutes.mastersLedgerMap, icon: 'journal' },
    { label: 'Governing Bodies', path: appRoutes.mastersGoverningBodies, icon: 'profile' },
];

/** Finance → Accounting */
export const financeAccountingNavigation = [
    { label: 'Chart of Accounts', path: appRoutes.chartOfAccounts, icon: 'accounts' },
    { label: 'Ledger', path: appRoutes.ledger, icon: 'ledger' },
    { label: 'Receipt Voucher', path: appRoutes.receiptVoucher, icon: 'receipt' },
    { label: 'Payment Voucher', path: appRoutes.paymentVoucher, icon: 'payment' },
    { label: 'Journal Voucher', path: appRoutes.journalVoucher, icon: 'journal' },
];

/** @deprecated Use financeAccountingNavigation */
export const financeNavigation = financeAccountingNavigation;

/** Top-level modules after Finance */
export const primaryModuleNavigation = [
    { label: 'Fixed Assets', path: appRoutes.fixedAssets, icon: 'accounts' },
    { label: 'Payroll', path: appRoutes.payroll, icon: 'group' },
    { label: 'Reports', path: appRoutes.reports, icon: 'reports' },
    { label: 'Utilities', path: appRoutes.utilities, icon: 'settings' },
];

export function searchableNavigation() {
    return [
        { label: 'Dashboard', path: appRoutes.dashboard, group: 'Main' },
        ...financeMastersNavigation.map((item) => ({
            label: item.label,
            path: item.path,
            group: 'Finance · Masters',
        })),
        ...financeAccountingNavigation.map((item) => ({
            label: item.label,
            path: item.path,
            group: 'Finance · Accounting',
        })),
        ...primaryModuleNavigation.map((item) => ({
            label: item.label,
            path: item.path,
            group: 'Modules',
        })),
        { label: 'Profile', path: appRoutes.profile, group: 'Account' },
        { label: 'Preferences', path: appRoutes.preferences, group: 'Account' },
    ];
}
