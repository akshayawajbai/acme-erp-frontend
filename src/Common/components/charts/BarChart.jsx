import { ChartEmpty, ChartLegend, alignSeries, chartColor, formatChartNumber, seriesExtent } from './chartUtils';

export function BarChart({
    labels = [],
    series = [],
    height = 220,
    stacked = false,
    ariaLabel = 'Bar chart',
}) {
    const safeLabels = Array.isArray(labels) ? labels.filter((label) => label != null && String(label).length > 0) : [];
    const aligned = alignSeries(safeLabels, Array.isArray(series) ? series : []);

    if (!safeLabels.length || !aligned.length) {
        return <ChartEmpty />;
    }

    const width = 640;
    const padding = { top: 16, right: 16, bottom: 36, left: 52 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const groupWidth = plotWidth / safeLabels.length;
    const stackedTotals = safeLabels.map((_, index) => aligned.reduce((sum, item) => sum + item.values[index], 0));
    const max = stacked ? Math.max(1, ...stackedTotals) : seriesExtent(aligned);
    const barPad = groupWidth * 0.18;
    const innerWidth = Math.max(groupWidth - barPad * 2, 4);
    const barWidth = stacked ? innerWidth : innerWidth / Math.max(aligned.length, 1);

    return (
        <div className="chart-shell">
            <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
                <title>{ariaLabel}</title>
                {[0, 0.5, 1].map((ratio) => {
                    const y = padding.top + plotHeight - ratio * plotHeight;
                    return (
                        <g key={ratio}>
                            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--color-border)" strokeWidth="1" />
                            <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="var(--color-body)">
                                {formatChartNumber(max * ratio)}
                            </text>
                        </g>
                    );
                })}
                {safeLabels.map((label, index) => {
                    const groupX = padding.left + index * groupWidth;
                    let stackOffset = 0;
                    return (
                        <g key={`${label}-${index}`}>
                            <text x={groupX + groupWidth / 2} y={height - 10} textAnchor="middle" fontSize="11" fill="var(--color-body)">
                                {label}
                            </text>
                            {aligned.map((item, seriesIndex) => {
                                const value = item.values[index];
                                const barHeight = (value / max) * plotHeight;
                                const color = item.color || chartColor(seriesIndex);
                                let x;
                                let y;
                                if (stacked) {
                                    x = groupX + barPad;
                                    y = padding.top + plotHeight - stackOffset - barHeight;
                                    stackOffset += barHeight;
                                }
                                else {
                                    x = groupX + barPad + seriesIndex * barWidth;
                                    y = padding.top + plotHeight - barHeight;
                                }
                                if (barHeight <= 0) {
                                    return null;
                                }
                                return (
                                    <rect
                                        key={item.id}
                                        x={x}
                                        y={y}
                                        width={Math.max(barWidth - (stacked ? 0 : 2), 2)}
                                        height={barHeight}
                                        fill={color}
                                        rx="2"
                                    >
                                        <title>{`${item.name}: ${value} (${label})`}</title>
                                    </rect>
                                );
                            })}
                        </g>
                    );
                })}
            </svg>
            <ChartLegend series={aligned.map((item, index) => ({ ...item, color: item.color || chartColor(index) }))} />
        </div>
    );
}
