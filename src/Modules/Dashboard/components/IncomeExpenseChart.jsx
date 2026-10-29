import { BarChart, ProgressGauge } from '../../../Common/components';
import { formatInr } from '../../../utilities/format';

/**
 * Compatibility wrapper used by the dashboard.
 * Renders shared chart primitives from income/expense totals.
 */
export function IncomeExpenseChart({ income, expenses }) {
    const total = Math.max(income + expenses, 1);
    return (
        <div className="stack" aria-label="Income compared with expenses">
            <BarChart
                labels={['Totals']}
                series={[
                    { id: 'income', name: 'Income', values: [income] },
                    { id: 'expenses', name: 'Expenses', values: [expenses] },
                ]}
                height={180}
                ariaLabel="Income and expenses comparison"
            />
            <ProgressGauge
                label="Income share of combined total"
                value={income}
                max={total}
                formatValue={() => `${formatInr(income)} / ${formatInr(total)}`}
                ariaLabel="Income share"
            />
        </div>
    );
}
