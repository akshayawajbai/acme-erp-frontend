import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataTable, EmptyState, ErrorState, PageHeader, Select, SummaryCard, TableSkeleton, } from '../../../Common/components';
import { breadcrumbsFor, pageDescriptions } from '../../../constants/navigation';
import { appRoutes } from '../../../constants/routes';
import { useAuth } from '../../../Context/AuthContext';
import { dashboardService } from '../../../services/dataProvider';
import { errorMessage } from '../../../utilities/errors';
import { formatDate, formatInr } from '../../../utilities/format';
import { IncomeExpenseChart } from '../components/IncomeExpenseChart';

const periodOptions = [
    { value: 'all', label: 'All recent dates' },
    { value: '2026-10-16', label: 'From 16 Oct 2026' },
    { value: '2026-10-18', label: 'From 18 Oct 2026' },
];

const voucherColumns = [
    { key: 'no', header: 'Voucher', render: (row) => row.voucherNo, sortValue: (row) => row.voucherNo },
    { key: 'date', header: 'Date', render: (row) => formatDate(row.date), sortValue: (row) => row.date },
    { key: 'type', header: 'Type', render: (row) => row.type, sortValue: (row) => row.type },
    { key: 'party', header: 'Party', render: (row) => row.party, sortValue: (row) => row.party },
    { key: 'amount', header: 'Amount', render: (row) => formatInr(row.amount), sortValue: (row) => row.amount },
];

const transactionColumns = [
    { key: 'date', header: 'Date', render: (row) => formatDate(row.date), sortValue: (row) => row.date },
    { key: 'description', header: 'Description', render: (row) => row.description, sortValue: (row) => row.description },
    { key: 'account', header: 'Account', render: (row) => row.account, sortValue: (row) => row.account },
    {
        key: 'amount',
        header: 'Amount',
        sortValue: (row) => row.direction === 'in' ? row.amount : -row.amount,
        render: (row) => (<span className={row.direction === 'in' ? 'amount-in' : 'amount-out'}>
        {row.direction === 'in' ? '+' : '−'}
        {formatInr(row.amount)}
      </span>),
    },
];

const quickLinks = [
    { label: 'Ledger', path: appRoutes.ledger },
    { label: 'Chart of Accounts', path: appRoutes.chartOfAccounts },
    { label: 'Receipt Voucher', path: appRoutes.receiptVoucher },
    { label: 'Reports', path: appRoutes.reports },
];

export function DashboardPage() {
    const { session } = useAuth();
    const [summary, setSummary] = useState(null);
    const [period, setPeriod] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            setSummary(await dashboardService.getSummary());
        }
        catch (loadError) {
            setSummary(null);
            setError(errorMessage(loadError));
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        void load();
    }, [load]);
    const vouchers = useMemo(() => filterByDate(summary?.recentVouchers ?? [], period), [summary, period]);
    const transactions = useMemo(() => filterByDate(summary?.recentTransactions ?? [], period), [summary, period]);
    return (<section>
      <PageHeader title="Dashboard" description={pageDescriptions[appRoutes.dashboard]} breadcrumbs={breadcrumbsFor(appRoutes.dashboard)}/>
      {session ? (<p className="office-line">Signed in to <strong>{session.headOfficeName}</strong> · {session.branchOfficeName}</p>) : null}
      <p className="demo-flag">Demonstration data. These Indian Rupee figures are fictional and are not accounting records.</p>
      {loading ? (<>
          <p className="sr-only">Loading dashboard</p>
          <TableSkeleton columns={4} rows={4}/>
        </>) : null}
      {error ? <ErrorState message={error} onRetry={() => void load()}/> : null}
      {!loading && !error && summary ? (<div className="stack">
          <div className="card-grid">
            <SummaryCard label="Total Income" value={formatInr(summary.totalIncome)} note="Full demonstration total"/>
            <SummaryCard label="Total Expenses" value={formatInr(summary.totalExpenses)} note="Full demonstration total"/>
            <SummaryCard label="Cash Balance" value={formatInr(summary.cashBalance)} note="Full demonstration total"/>
            <SummaryCard label="Bank Balance" value={formatInr(summary.bankBalance)} note="Full demonstration total"/>
          </div>
          <div className="dashboard-grid">
            <section className="panel">
              <h2>Income and expenses</h2>
              <IncomeExpenseChart income={summary.totalIncome} expenses={summary.totalExpenses}/>
            </section>
            <section className="panel">
              <h2>Quick actions</h2>
              <div className="quick-actions">
                {quickLinks.map((item) => (<Link key={item.path} className="btn btn-outline btn-small" to={item.path}>{item.label}</Link>))}
              </div>
            </section>
          </div>
          <div className="activity-toolbar">
            <Select id="activity-period" label="Recent activity" hidePlaceholder value={period} options={periodOptions} onChange={setPeriod}/>
            <p className="page-description">The date filter applies to the lists below. Summary totals stay on the full demonstration set.</p>
          </div>
          <section className="panel">
            <h2>Recent vouchers</h2>
            {vouchers.length === 0 ? (<EmptyState title="No vouchers in this period" message="Choose another date range to see the demonstration vouchers."/>) : (<DataTable columns={voucherColumns} rows={vouchers} getRowKey={(row) => row.id} caption="Recent vouchers"/>)}
          </section>
          <section className="panel">
            <h2>Recent transactions</h2>
            {transactions.length === 0 ? (<EmptyState title="No transactions in this period" message="Choose another date range to see the demonstration transactions."/>) : (<DataTable columns={transactionColumns} rows={transactions} getRowKey={(row) => row.id} caption="Recent transactions"/>)}
          </section>
        </div>) : null}
    </section>);
}

function filterByDate(rows, period) {
    if (period === 'all') {
        return rows;
    }
    return rows.filter((row) => row.date >= period);
}
