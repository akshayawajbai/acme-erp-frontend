import { formatInr } from '../../../utilities/format';
export function IncomeExpenseChart({ income, expenses }) {
    const maximum = Math.max(income, expenses, 1);
    const incomeWidth = `${Math.round((income / maximum) * 100)}%`;
    const expenseWidth = `${Math.round((expenses / maximum) * 100)}%`;
    return (<div className="chart" aria-label="Income compared with expenses">
      <div className="chart-row">
        <div className="chart-label">
          <span>Income</span>
          <strong>{formatInr(income)}</strong>
        </div>
        <div className="bar-track">
          <div className="bar-fill" style={{ width: incomeWidth }}/>
        </div>
      </div>
      <div className="chart-row">
        <div className="chart-label">
          <span>Expenses</span>
          <strong>{formatInr(expenses)}</strong>
        </div>
        <div className="bar-track">
          <div className="bar-fill is-expense" style={{ width: expenseWidth }}/>
        </div>
      </div>
    </div>);
}
