import { PageHeader } from '../../../Common/components';
import { breadcrumbsFor, pageDescriptions } from '../../../constants/navigation';
import { appRoutes } from '../../../constants/routes';

function ModulePlaceholder({ title, path, note = 'This module is prepared for future workflows and does not change live data yet.' }) {
    return (
        <section>
            <PageHeader title={title} breadcrumbs={breadcrumbsFor(path)} />
            <div className="workspace-note">
                <h2>Under development</h2>
                <p>{pageDescriptions[path]}</p>
                <p>{note}</p>
            </div>
        </section>
    );
}

function FinancePlaceholder({ title, path }) {
    return (
        <ModulePlaceholder
            title={title}
            path={path}
            note="This page does not post vouchers or change accounts yet."
        />
    );
}

export function ChartOfAccountsPage() {
    return <FinancePlaceholder title="Chart of Accounts" path={appRoutes.chartOfAccounts} />;
}
export function LedgerGroupPage() {
    return <FinancePlaceholder title="Ledger Group" path={appRoutes.ledgerGroup} />;
}
export function ReceiptVoucherPage() {
    return <FinancePlaceholder title="Receipt Voucher" path={appRoutes.receiptVoucher} />;
}
export function PaymentVoucherPage() {
    return <FinancePlaceholder title="Payment Voucher" path={appRoutes.paymentVoucher} />;
}
export function JournalVoucherPage() {
    return <FinancePlaceholder title="Journal Voucher" path={appRoutes.journalVoucher} />;
}
export function ReportsPage() {
    return <ModulePlaceholder title="Reports" path={appRoutes.reports} />;
}
export function FixedAssetsPage() {
    return <ModulePlaceholder title="Fixed Assets" path={appRoutes.fixedAssets} />;
}
export function PayrollPage() {
    return <ModulePlaceholder title="Payroll" path={appRoutes.payroll} />;
}
export function UtilitiesPage() {
    return <ModulePlaceholder title="Utilities" path={appRoutes.utilities} />;
}
