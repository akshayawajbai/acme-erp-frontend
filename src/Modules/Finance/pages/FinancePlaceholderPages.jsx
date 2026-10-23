import { EmptyState, PageHeader } from '../../../Common/components';
import { breadcrumbsFor, pageDescriptions } from '../../../constants/navigation';
import { appRoutes } from '../../../constants/routes';
function FinancePlaceholder({ title, path }) {
    return (<section>
      <PageHeader title={title} description={pageDescriptions[path]} breadcrumbs={breadcrumbsFor(path)}/>
      <EmptyState title="Under development" message="This module is under development. The page is ready for a service-backed workflow when that work begins."/>
    </section>);
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
