import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActionCard,
    AreaChart,
    Button,
    ChartCard,
    DataTable,
    DonutChart,
    EmptyState,
    ErrorState,
    PageHeader,
    ProgressGauge,
    Select,
    StatCard,
    TableSkeleton,
} from '../../../Common/components';
import { breadcrumbsFor, pageDescriptions } from '../../../constants/navigation';
import { appRoutes } from '../../../constants/routes';
import { useAuth } from '../../../Context/AuthContext';
import { apiConfig } from '../../../Api_Config/apiConfig';
import { dashboardService } from '../../../services/dataProvider';
import {
    activityPeriodOptions,
    filterRowsByPeriod,
    getPeriodBounds,
} from '../../../utilities/dates';
import { errorMessage } from '../../../utilities/errors';
import { formatDate, formatInr } from '../../../utilities/format';
import {
    clearStoredDashboardLayout,
    createDefaultDashboardLayout,
    getWidgetMeta,
    readStoredDashboardLayout,
    writeStoredDashboardLayout,
} from '../dashboardLayout';
import { DashboardCustomizePanel } from '../components/DashboardCustomizePanel';
import { IncomeExpenseChart } from '../components/IncomeExpenseChart';

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
        sortValue: (row) => (row.direction === 'in' ? row.amount : -row.amount),
        render: (row) => (
            <span className={row.direction === 'in' ? 'amount-in' : 'amount-out'}>
                {row.direction === 'in' ? '+' : '−'}
                {formatInr(row.amount)}
            </span>
        ),
    },
];

const quickLinks = [
    { id: 'ledger', label: 'Ledger', path: appRoutes.ledger },
    { id: 'coa', label: 'Chart of Accounts', path: appRoutes.chartOfAccounts },
    { id: 'receipt', label: 'Receipt Voucher', path: appRoutes.receiptVoucher },
    { id: 'reports', label: 'Reports', path: appRoutes.reports },
];

export function DashboardPage() {
    const { session } = useAuth();
    const [summary, setSummary] = useState(null);
    const [period, setPeriod] = useState('all');
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [layout, setLayout] = useState(readStoredDashboardLayout);
    const [customizing, setCustomizing] = useState(false);
    const [dragId, setDragId] = useState(null);
    const [dropId, setDropId] = useState(null);
    const isDemo = apiConfig.dataMode !== 'api';

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

    useEffect(() => {
        writeStoredDashboardLayout(layout);
    }, [layout]);

    const customRange = useMemo(() => ({ from: customFrom, to: customTo }), [customFrom, customTo]);
    const periodBounds = useMemo(() => getPeriodBounds(period, new Date(), customRange), [period, customRange]);
    const periodDescription = period === 'all'
        ? 'Showing all returned activity records. Summary totals are not period-filtered by the current service.'
        : periodBounds?.invalid
            ? periodBounds.label
            : `${periodBounds?.label || 'Selected period'}. Summary totals are not period-filtered by the current service.`;

    const vouchers = useMemo(
        () => filterRowsByPeriod(summary?.recentVouchers ?? [], period, customRange),
        [summary, period, customRange],
    );
    const transactions = useMemo(
        () => filterRowsByPeriod(summary?.recentTransactions ?? [], period, customRange),
        [summary, period, customRange],
    );

    const trendLabels = summary?.monthlyTrend?.map((row) => row.label) ?? [];
    const trendSeries = useMemo(() => {
        if (!summary?.monthlyTrend?.length) {
            return [];
        }
        return [
            { id: 'income', name: 'Income', values: summary.monthlyTrend.map((row) => row.income) },
            { id: 'expenses', name: 'Expenses', values: summary.monthlyTrend.map((row) => row.expenses) },
        ];
    }, [summary]);

    const visibleWidgets = layout.filter((item) => item.visible);
    const emptyActivityMessage = isDemo
        ? 'Choose another date range to see available demonstration records.'
        : 'Choose another date range or confirm records exist for this period.';

    function updateLayout(next) {
        setLayout(next);
    }

    function resetLayout() {
        clearStoredDashboardLayout();
        setLayout(createDefaultDashboardLayout());
    }

    function onDragStart(event, id) {
        setDragId(id);
        try {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', id);
        }
        catch {
            // Some browsers restrict dataTransfer during tests; visual state still works.
        }
    }

    function onDragOver(event, id) {
        event.preventDefault();
        if (id !== dropId) {
            setDropId(id);
        }
    }

    function onDrop(event, targetId) {
        event.preventDefault();
        const sourceId = dragId || (() => {
            try {
                return event.dataTransfer.getData('text/plain');
            }
            catch {
                return null;
            }
        })();
        if (!sourceId || sourceId === targetId) {
            setDragId(null);
            setDropId(null);
            return;
        }
        const from = layout.findIndex((item) => item.id === sourceId);
        const to = layout.findIndex((item) => item.id === targetId);
        if (from < 0 || to < 0) {
            setDragId(null);
            setDropId(null);
            return;
        }
        const next = layout.slice();
        const [row] = next.splice(from, 1);
        next.splice(to, 0, row);
        setLayout(next);
        setDragId(null);
        setDropId(null);
    }

    function renderWidget(widget) {
        if (!summary) {
            return null;
        }

        switch (widget.id) {
            case 'totalIncome':
                return (
                    <StatCard
                        title="Total Income"
                        value={formatInr(summary.totalIncome)}
                        note={isDemo ? 'Demonstration total' : 'Reported income total'}
                    />
                );
            case 'totalExpenses':
                return (
                    <StatCard
                        title="Total Expenses"
                        value={formatInr(summary.totalExpenses)}
                        note={isDemo ? 'Demonstration total' : 'Reported expense total'}
                    />
                );
            case 'cashBalance':
                return (
                    <StatCard
                        title="Cash Balance"
                        value={formatInr(summary.cashBalance)}
                        note={isDemo ? 'Demonstration total' : 'Cash on hand'}
                    />
                );
            case 'bankBalance':
                return (
                    <StatCard
                        title="Bank Balance"
                        value={formatInr(summary.bankBalance)}
                        note={isDemo ? 'Demonstration total' : 'Bank accounts'}
                    />
                );
            case 'incomeExpenseTrend':
                return (
                    <ChartCard
                        title="Income versus expenses"
                        subtitle={trendSeries.length ? 'Monthly series from the dashboard summary' : 'Comparison of reported income and expense totals'}
                        empty={!trendSeries.length && !(summary.totalIncome || summary.totalExpenses)}
                    >
                        {trendSeries.length ? (
                            <AreaChart
                                labels={trendLabels}
                                series={trendSeries}
                                ariaLabel="Income versus expenses over time"
                            />
                        ) : (
                            <IncomeExpenseChart income={summary.totalIncome} expenses={summary.totalExpenses} />
                        )}
                    </ChartCard>
                );
            case 'expenseBreakdown':
                return (
                    <ChartCard
                        title="Expense breakdown"
                        subtitle={isDemo ? 'Demonstration expense categories' : 'Expense categories from the dashboard summary'}
                        empty={!(summary.expenseBreakdown?.length)}
                    >
                        <DonutChart
                            segments={summary.expenseBreakdown || []}
                            ariaLabel="Expense category breakdown"
                        />
                    </ChartCard>
                );
            case 'cashFlowGauge': {
                const net = summary.totalIncome - summary.totalExpenses;
                const coverageMax = Math.max(summary.totalExpenses, 1);
                return (
                    <ChartCard title="Net position" subtitle="Income minus expenses from the current summary">
                        <div className="stack">
                            <ProgressGauge
                                label="Income relative to expenses"
                                value={Math.max(summary.totalIncome, 0)}
                                max={coverageMax}
                                formatValue={() => formatInr(net)}
                                ariaLabel="Net financial position"
                            />
                            <IncomeExpenseChart income={summary.totalIncome} expenses={summary.totalExpenses} />
                        </div>
                    </ChartCard>
                );
            }
            case 'quickActions':
                return <ActionCard title="Quick actions" actions={quickLinks} />;
            case 'recentVouchers':
                return (
                    <ChartCard
                        title="Recent vouchers"
                        subtitle={periodDescription}
                        headerActions={(
                            <div className="dashboard-period-controls">
                                <Select
                                    id="activity-period"
                                    label="Period"
                                    hidePlaceholder
                                    value={period}
                                    options={activityPeriodOptions}
                                    onChange={setPeriod}
                                />
                                {period === 'custom' ? (
                                    <div className="dashboard-custom-range">
                                        <label className="field" htmlFor="activity-from">
                                            <span>From</span>
                                            <input
                                                id="activity-from"
                                                className="control"
                                                type="date"
                                                value={customFrom}
                                                onChange={(event) => setCustomFrom(event.target.value)}
                                            />
                                        </label>
                                        <label className="field" htmlFor="activity-to">
                                            <span>To</span>
                                            <input
                                                id="activity-to"
                                                className="control"
                                                type="date"
                                                value={customTo}
                                                onChange={(event) => setCustomTo(event.target.value)}
                                            />
                                        </label>
                                    </div>
                                ) : null}
                            </div>
                        )}
                    >
                        {vouchers.length === 0 ? (
                            <EmptyState title="No vouchers in this period" message={emptyActivityMessage} />
                        ) : (
                            <DataTable columns={voucherColumns} rows={vouchers} getRowKey={(row) => row.id} caption="Recent vouchers" />
                        )}
                    </ChartCard>
                );
            case 'recentTransactions':
                return (
                    <ChartCard title="Recent transactions" subtitle={periodDescription}>
                        {transactions.length === 0 ? (
                            <EmptyState title="No transactions in this period" message={emptyActivityMessage} />
                        ) : (
                            <DataTable columns={transactionColumns} rows={transactions} getRowKey={(row) => row.id} caption="Recent transactions" />
                        )}
                    </ChartCard>
                );
            default:
                return null;
        }
    }

    return (
        <section>
            <PageHeader
                title="Dashboard"
                description={pageDescriptions[appRoutes.dashboard]}
                breadcrumbs={breadcrumbsFor(appRoutes.dashboard)}
                actions={(
                    <Button variant="outline" size="small" onClick={() => setCustomizing((value) => !value)}>
                        {customizing ? 'Close customize' : 'Customize'}
                    </Button>
                )}
            />
            {session ? (
                <p className="office-line">
                    Signed in to <strong>{session.headOfficeName}</strong>
                    {' '}
                    ·
                    {' '}
                    {session.branchOfficeName}
                </p>
            ) : null}
            {isDemo ? (
                <p className="demo-flag">Demonstration data. These Indian Rupee figures are fictional and are not accounting records.</p>
            ) : null}

            {customizing ? (
                <DashboardCustomizePanel
                    layout={layout}
                    onChange={updateLayout}
                    onReset={resetLayout}
                    onDone={() => setCustomizing(false)}
                />
            ) : null}

            {loading ? (
                <>
                    <p className="sr-only">Loading dashboard</p>
                    <TableSkeleton columns={4} rows={4} />
                </>
            ) : null}
            {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}

            {!loading && !error && summary ? (
                <div className="dashboard-widget-grid">
                    {visibleWidgets.map((widget) => {
                        const meta = getWidgetMeta(widget.id);
                        return (
                            <div
                                key={widget.id}
                                className={[
                                    'dashboard-widget',
                                    `size-${widget.size}`,
                                    dragId === widget.id ? 'is-dragging' : '',
                                    dropId === widget.id ? 'is-drop-target' : '',
                                ].filter(Boolean).join(' ')}
                                onDragOver={customizing ? (event) => onDragOver(event, widget.id) : undefined}
                                onDrop={customizing ? (event) => onDrop(event, widget.id) : undefined}
                            >
                                {customizing ? (
                                    <button
                                        type="button"
                                        className="widget-drag-handle"
                                        draggable
                                        aria-label={`Drag ${meta?.label || widget.id}`}
                                        onDragStart={(event) => onDragStart(event, widget.id)}
                                        onDragEnd={() => {
                                            setDragId(null);
                                            setDropId(null);
                                        }}
                                    >
                                        ⋮⋮ Drag to reorder
                                    </button>
                                ) : null}
                                {renderWidget(widget)}
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </section>
    );
}
