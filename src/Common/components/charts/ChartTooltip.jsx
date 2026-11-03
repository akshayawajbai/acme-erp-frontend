export function ChartTooltip({ x, y, children }) {
    if (x == null || y == null) {
        return null;
    }
    return (
        <div className="chart-tooltip" style={{ left: `${x}%`, top: `${y}%` }} role="tooltip">
            {children}
        </div>
    );
}
