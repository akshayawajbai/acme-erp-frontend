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
    [appRoutes.fixedAssets]: 'Fixed Assets',
    [appRoutes.payroll]: 'Payroll',
    [appRoutes.utilities]: 'Utilities',
    [appRoutes.mastersBranchOffice]: 'Branch Office',
    [appRoutes.mastersSociety]: 'Society / Trust Master',
    [appRoutes.mastersLocation]: 'Location Master',
    [appRoutes.mastersProjectCategory]: 'Project Category Master',
    [appRoutes.mastersProject]: 'Project Master',
    [appRoutes.mastersProjectMap]: 'Project Mapping',
    [appRoutes.mastersBankAccount]: 'Bank Account Master',
    [appRoutes.mastersLedgerGroup]: 'Ledger Group Master',
    [appRoutes.mastersLedger]: 'Ledger Master',
    [appRoutes.mastersLedgerMap]: 'Master Ledger Mapping',
    [appRoutes.mastersGoverningBodies]: 'Governing Bodies (As per Aadhaar)',
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
    [appRoutes.fixedAssets]: 'Fixed asset registers and depreciation workflows will be managed here.',
    [appRoutes.payroll]: 'Payroll processing and employee payment workflows will be managed here.',
    [appRoutes.utilities]: 'System utilities and maintenance tools will be listed here.',
    [appRoutes.mastersBranchOffice]: 'Maintain branch office identity, deployment model, and communication details.',
    [appRoutes.mastersSociety]: 'Register society and trust compliance details for finance operations.',
    [appRoutes.mastersLocation]: 'Map locations to branch offices for project and voucher workflows.',
    [appRoutes.mastersProjectCategory]: 'Organize projects by income-tax and generalate groupings.',
    [appRoutes.mastersProject]: 'Define projects against society, category, and division.',
    [appRoutes.mastersProjectMap]: 'Map projects to branch offices, sectors, and users with active dates.',
    [appRoutes.mastersBankAccount]: 'Maintain bank accounts used for receipts, payments, and reconciliation.',
    [appRoutes.mastersLedgerGroup]: 'Group ledgers by income, expenditure, asset, or liability nature.',
    [appRoutes.mastersLedger]: 'Maintain ledger masters with group, category, and validity dates.',
    [appRoutes.mastersLedgerMap]: 'Configure special ledger behaviour for FD, TDS, depreciation, and interest.',
    [appRoutes.mastersGoverningBodies]: 'Record governing body members with enrolment and identity details.',
    [appRoutes.profile]: 'The office and demonstration identity stored for this browser session.',
    [appRoutes.preferences]: 'Choose how ACME ERP appears on this device.',
};

export function breadcrumbsFor(path) {
    if (path === appRoutes.dashboard) {
        return [{ label: 'Dashboard' }];
    }
    const title = pageTitles[path] ?? 'Page';
    if (path.startsWith('/finance/masters/')) {
        return [
            { label: 'Dashboard', to: appRoutes.dashboard },
            { label: 'Finance' },
            { label: 'Masters' },
            { label: title },
        ];
    }
    if (path.startsWith('/finance/')) {
        return [
            { label: 'Dashboard', to: appRoutes.dashboard },
            { label: 'Finance' },
            { label: 'Accounting' },
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
