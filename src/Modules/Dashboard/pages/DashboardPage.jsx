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
    Select,
    StatCard,
    TableSkeleton,
} from '../../../Common/components';
import { breadcrumbsFor } from '../../../constants/navigation';
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
import {
    AccountsIcon,
    FinanceIcon,
    LedgerIcon,
    PaymentIcon,
    ReceiptIcon,
    ReportsIcon,
} from '../../../Common/components/Icons';
import { IncomeExpenseChart } from '../components/IncomeExpenseChart';

const voucherColumns = [
    { key: 'no', header: 'Voucher', className: 'col-code', render: (row) => row.voucherNo, sortValue: (row) => row.voucherNo },
    { key: 'date', header: 'Date', className: 'col-date', render: (row) => formatDate(row.date), sortValue: (row) => row.date },
    { key: 'type', header: 'Type', className: 'col-type', render: (row) => row.type, sortValue: (row) => row.type },
    { key: 'party', header: 'Party', className: 'col-party', render: (row) => row.party, sortValue: (row) => row.party },
    { key: 'amount', header: 'Amount', className: 'col-amount', align: 'end', render: (row) => formatInr(row.amount), sortValue: (row) => row.amount },
];

const transactionColumns = [
    { key: 'date', header: 'Date', className: 'col-date', render: (row) => formatDate(row.date), sortValue: (row) => row.date },
    {
        key: 'description',
        header: 'Description',
        className: 'col-party',
        render: (row) => <span className="register-primary">{row.description}</span>,
        sortValue: (row) => row.description,
    },
    { key: 'account', header: 'Account', className: 'col-account', render: (row) => row.account, sortValue: (row) => row.account },
    {
        key: 'amount',
        header: 'Amount',
        className: 'col-amount',
        align: 'end',
        sortValue: (row) => (row.direction === 'in' ? row.amount : -row.amount),
        render: (row) => (
            <span className={row.direction === 'in' ? 'amount-in' : 'amount-out'}>
                {row.direction === 'in' ? '+' : '−'}
                {formatInr(row.amount)}
            </span>
        ),
    },
];

const metricsRun = ['totalIncome', 'totalExpenses', 'cashBalance', 'bankBalance'];
const analyticsRun = ['incomeExpenseTrend', 'expenseBreakdown', 'cashFlowGauge'];
const activityRun = ['recentVouchers', 'recentTransactions'];

const breakdownColors = [
    'var(--color-primary)',
    'var(--color-text)',
    '#007a96',
    '#5fd4ea',
    'var(--color-body)',
];

const quickLinks = [
    { id: 'ledger', label: 'Ledger', path: appRoutes.ledger, icon: LedgerIcon },
    { id: 'coa', label: 'Chart of Accounts', path: appRoutes.chartOfAccounts, icon: AccountsIcon },
    { id: 'receipt', label: 'Receipt Voucher', path: appRoutes.receiptVoucher, icon: ReceiptIcon },
    { id: 'reports', label: 'Reports', path: appRoutes.reports, icon: ReportsIcon },
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
        ? 'Latest activity returned for this office.'
        : periodBounds?.invalid
            ? periodBounds.label
            : `${periodBounds?.label || 'Selected period'}. Summary totals stay on the full return.`;

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
            { id: 'income', name: 'Income', color: 'var(--color-primary)', values: summary.monthlyTrend.map((row) => row.income) },
            { id: 'expenses', name: 'Expenses', color: 'var(--color-text)', fill: false, values: summary.monthlyTrend.map((row) => row.expenses) },
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
                        tone="metric"
                        className="metric-card metric-card--income"
                        title="Total income"
                        value={formatInr(summary.totalIncome)}
                        note="Full summary total"
                        detail={isDemo
                            ? 'Demonstration total from the current dashboard summary. Activity period filters do not change this figure.'
                            : 'Reported income total from the current dashboard summary. Activity period filters do not change this figure.'}
                        icon={<FinanceIcon />}
                    />
                );
            case 'totalExpenses':
                return (
                    <StatCard
                        tone="metric"
                        className="metric-card metric-card--expense"
                        title="Total expenses"
                        value={formatInr(summary.totalExpenses)}
                        note="Full summary total"
                        detail={isDemo
                            ? 'Demonstration total from the current dashboard summary. Activity period filters do not change this figure.'
                            : 'Reported expense total from the current dashboard summary. Activity period filters do not change this figure.'}
                        icon={<ReceiptIcon />}
                    />
                );
            case 'cashBalance':
                return (
                    <StatCard
                        tone="metric"
                        className="metric-card metric-card--balance"
                        title="Cash balance"
                        value={formatInr(summary.cashBalance)}
                        note={isDemo ? 'Cash on hand' : 'Cash on hand'}
                        detail={isDemo
                            ? 'Demonstration cash balance from the current dashboard summary.'
                            : 'Cash on hand from the current dashboard summary.'}
                        icon={<PaymentIcon />}
                    />
                );
            case 'bankBalance':
                return (
                    <StatCard
                        tone="metric"
                        className="metric-card metric-card--balance"
                        title="Bank balance"
                        value={formatInr(summary.bankBalance)}
                        note={isDemo ? 'Bank accounts' : 'Bank accounts'}
                        detail={isDemo
                            ? 'Demonstration bank balance from the current dashboard summary.'
                            : 'Bank account balance from the current dashboard summary.'}
                        icon={<AccountsIcon />}
                    />
                );
            case 'incomeExpenseTrend':
                return (
                    <ChartCard
                        className="chart-card--trend"
                        title="Income versus expenses"
                        subtitle={trendSeries.length ? 'Monthly amounts from the summary' : 'Reported income and expense totals'}
                        empty={!trendSeries.length && !(summary.totalIncome || summary.totalExpenses)}
                    >
                        {trendSeries.length ? (
                            <AreaChart
                                labels={trendLabels}
                                series={trendSeries}
                                formatValue={formatInr}
                                frameWidth={820}
                                height={280}
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
                        className="chart-card--breakdown"
                        title="Expense breakdown"
                        subtitle={isDemo ? 'Demonstration categories' : 'Categories from the summary'}
                        empty={!(summary.expenseBreakdown?.length)}
                    >
                        <DonutChart
                            segments={(summary.expenseBreakdown || []).map((segment, index) => ({
                                ...segment,
                                color: breakdownColors[index % breakdownColors.length],
                            }))}
                            formatValue={formatInr}
                            size={240}
                            ariaLabel="Expense category breakdown"
                        />
                    </ChartCard>
                );
            case 'cashFlowGauge': {
                const net = summary.totalIncome - summary.totalExpenses;
                const income = Math.max(summary.totalIncome, 0);
                const expenses = Math.max(summary.totalExpenses, 0);
                const combined = income + expenses;
                const incomeShare = combined > 0 ? (income / combined) * 100 : 50;
                const expenseShare = combined > 0 ? (expenses / combined) * 100 : 50;
                const isPositive = net >= 0;
                return (
                    <section
                        className={`net-position ${isPositive ? 'is-positive' : 'is-negative'}`}
                        aria-label="Net position"
                    >
                        <div className="net-position__primary">
                            <div className="net-position__head">
                                <h2 className="net-position__label">Net position</h2>
                                <p className={`net-position__status ${isPositive ? 'is-positive' : 'is-negative'}`}>
                                    {isPositive ? 'Surplus' : 'Deficit'}
                                </p>
                            </div>
                            <p className={`net-position__value ${isPositive ? 'is-positive' : 'is-negative'}`}>
                                {formatInr(net)}
                            </p>
                            <p className="net-position__meaning">
                                {isPositive
                                    ? 'Income exceeds expenses for this period'
                                    : 'Expenses exceed income for this period'}
                            </p>
                        </div>
                        <div className="net-position__secondary">
                            <div
                                className="net-position__bar"
                                role="img"
                                aria-label={`Income ${Math.round(incomeShare)} percent, expenses ${Math.round(expenseShare)} percent of combined total`}
                            >
                                <span className="net-position__bar-income" style={{ width: `${incomeShare}%` }} />
                                <span className="net-position__bar-expense" style={{ width: `${expenseShare}%` }} />
                            </div>
                            <dl className="net-position__sources">
                                <div>
                                    <dt>Income</dt>
                                    <dd className="is-income">{formatInr(summary.totalIncome)}</dd>
                                </div>
                                <div>
                                    <dt>Expenses</dt>
                                    <dd className="is-expense">{formatInr(summary.totalExpenses)}</dd>
                                </div>
                            </dl>
                        </div>
                    </section>
                );
            }
            case 'quickActions':
                return <ActionCard className="action-card--plain" title="Workspace" subtitle="Open a finance screen" actions={quickLinks} />;
            case 'recentVouchers':
                return (
                    <ChartCard className="chart-card--register register--vouchers" title="Recent vouchers" subtitle={periodDescription}>
                        {vouchers.length === 0 ? (
                            <EmptyState title="No vouchers in this period" message={emptyActivityMessage} />
                        ) : (
                            <DataTable columns={voucherColumns} rows={vouchers} getRowKey={(row) => row.id} caption="Recent vouchers" />
                        )}
                    </ChartCard>
                );
            case 'recentTransactions':
                return (
                    <ChartCard className="chart-card--register register--transactions" title="Recent transactions" subtitle={periodDescription}>
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

    function widgetFrame(widget, className) {
        const meta = getWidgetMeta(widget.id);
        return (
            <div
                key={widget.id}
                data-widget={widget.id}
                className={className}
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
    }

    function frameClass(widget, extra) {
        return [
            extra,
            dragId === widget.id ? 'is-dragging' : '',
            dropId === widget.id ? 'is-drop-target' : '',
        ].filter(Boolean).join(' ');
    }

    function matchesDefaultRun(start, ids) {
        return ids.every((id, offset) => {
            const widget = visibleWidgets[start + offset];
            return widget?.id === id && widget.size === getWidgetMeta(id)?.defaultSize;
        });
    }

    function renderDashboardNodes() {
        const nodes = [];
        let index = 0;
        while (index < visibleWidgets.length) {
            if (!customizing && matchesDefaultRun(index, metricsRun)) {
                const metrics = visibleWidgets.slice(index, index + metricsRun.length);
                nodes.push(
                    <div className="metrics-board" key={`metrics-${index}`}>
                        {metrics.map((widget) => widgetFrame(widget, frameClass(widget, 'metrics-board__item')))}
                    </div>,
                );
                index += metricsRun.length;
                continue;
            }
            if (!customizing && matchesDefaultRun(index, analyticsRun)) {
                const [trend, breakdown, net] = visibleWidgets.slice(index, index + analyticsRun.length);
                nodes.push(
                    <div className="analytics" key={`analytics-${index}`}>
                        {widgetFrame(trend, frameClass(trend, 'analytics__main'))}
                        {widgetFrame(breakdown, frameClass(breakdown, 'analytics__panel analytics__panel--breakdown'))}
                        {widgetFrame(net, frameClass(net, 'analytics__panel analytics__panel--net'))}
                    </div>,
                );
                index += analyticsRun.length;
                continue;
            }
            if (!customizing && matchesDefaultRun(index, activityRun)) {
                const pair = visibleWidgets.slice(index, index + activityRun.length);
                nodes.push(
                    <div className="activity-board" key={`activity-${index}`}>
                        {pair.map((widget) => widgetFrame(widget, frameClass(widget, 'activity-board__item')))}
                    </div>,
                );
                index += activityRun.length;
                continue;
            }
            const widget = visibleWidgets[index];
            nodes.push(widgetFrame(
                widget,
                frameClass(widget, `dashboard-widget size-${widget.size}`),
            ));
            index += 1;
        }
        return nodes;
    }

    return (
        <section className="dashboard-page">
            <PageHeader
                title="Dashboard"
                breadcrumbs={breadcrumbsFor(appRoutes.dashboard)}
                description={session ? `${session.headOfficeName} / ${session.branchOfficeName}` : undefined}
                actions={(
                    <div className="dashboard-heading__actions">
                        <Select
                            id="activity-period"
                            label="Reporting period"
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
                        <Button variant="outline" size="small" onClick={() => setCustomizing((value) => !value)}>
                            {customizing ? 'Close customize' : 'Customize'}
                        </Button>
                    </div>
                )}
            />
            {/* {isDemo ? (
                <p className="demo-flag">Demonstration figures. They are not accounting records.</p>
            ) : null} */}

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
                    {renderDashboardNodes()}
                </div>
            ) : null}
        </section>
    );
}
