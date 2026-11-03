import { PageHeader } from '../../../Common/components';
import { breadcrumbsFor, pageDescriptions } from '../../../constants/navigation';
import { appRoutes } from '../../../constants/routes';
function FinancePlaceholder({ title, path }) {
    return (
        <section>
            <PageHeader title={title} breadcrumbs={breadcrumbsFor(path)} />
            <div className="workspace-note">
                <h2>Under development</h2>
                <p>{pageDescriptions[path]}</p>
                <p>This page does not post vouchers or change accounts yet.</p>
            </div>
        </section>
    );
}
export function ChartOfAccountsPage() {
    return <FinancePlaceholder title="Chart of Accounts" path={appRoutes.chartOfAccounts}/>;
}
export function LedgerGroupPage() {
    return <FinancePlaceholder title="Ledger Group" path={appRoutes.ledgerGroup}/>;
}
export function ReceiptVoucherPage() {
    return <FinancePlaceholder title="Receipt Voucher" path={appRoutes.receiptVoucher}/>;
}
export function PaymentVoucherPage() {
    return <FinancePlaceholder title="Payment Voucher" path={appRoutes.paymentVoucher}/>;
}
export function JournalVoucherPage() {
    return <FinancePlaceholder title="Journal Voucher" path={appRoutes.journalVoucher}/>;
}
export function ReportsPage() {
    return <FinancePlaceholder title="Reports" path={appRoutes.reports}/>;
}
