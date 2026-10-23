import { appRoutes } from './routes';
const pageTitles = {
    [appRoutes.dashboard]: 'Dashboard',
    [appRoutes.chartOfAccounts]: 'Chart of Accounts',
    [appRoutes.ledger]: 'Ledger',
    [appRoutes.ledgerGroup]: 'Ledger Group',
    [appRoutes.receiptVoucher]: 'Receipt Voucher',
    [appRoutes.paymentVoucher]: 'Payment Voucher',
    [appRoutes.journalVoucher]: 'Journal Voucher',
    [appRoutes.reports]: 'Reports',
    [appRoutes.profile]: 'Profile',
    [appRoutes.preferences]: 'Preferences',
};
export const pageDescriptions = {
    [appRoutes.dashboard]: 'Demonstration balances and recent activity for the office you signed in to.',
    [appRoutes.chartOfAccounts]: 'The account structure for this office will be managed here.',
    [appRoutes.ledger]: 'Search and maintain demonstration ledger records for the selected office.',
    [appRoutes.ledgerGroup]: 'Ledger groups will organize accounts once this workflow is connected.',
    [appRoutes.receiptVoucher]: 'Receipt vouchers will be entered here when the workflow is ready.',
    [appRoutes.paymentVoucher]: 'Payment vouchers will be entered here when the workflow is ready.',
    [appRoutes.journalVoucher]: 'Journal vouchers will be entered here when the workflow is ready.',
    [appRoutes.reports]: 'Financial reports will be listed here when the workflow is ready.',
    [appRoutes.profile]: 'The office and demonstration identity stored for this browser session.',
    [appRoutes.preferences]: 'Choose how ACME ERP appears on this device.',
};
export function breadcrumbsFor(path) {
    if (path === appRoutes.dashboard) {
        return [{ label: 'Dashboard' }];
    }
    const title = pageTitles[path] ?? 'Page';
    if (path.startsWith('/finance/')) {
        return [
            { label: 'Dashboard', to: appRoutes.dashboard },
            { label: 'Finance' },
            { label: title },
        ];
    }
    return [
        { label: 'Dashboard', to: appRoutes.dashboard },
        { label: title },
    ];
}
export function pageTitleFor(path) {
    return pageTitles[path] ?? 'Page';
}
