import { ChartEmpty, ChartLegend, chartColor, seriesExtent } from './chartUtils';

export function BarChart({
    labels = [],
    series = [],
    height = 220,
    stacked = false,
    ariaLabel = 'Bar chart',
}) {
    if (!labels.length || !series.length) {
        return <ChartEmpty />;
    }

    const width = 640;
    const padding = { top: 16, right: 16, bottom: 36, left: 48 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const groupWidth = plotWidth / labels.length;
    const max = stacked
        ? Math.max(
            1,
            ...labels.map((_, index) => series.reduce((sum, item) => sum + (Number(item.values?.[index]) || 0), 0)),
        )
        : seriesExtent(series);
    const barPad = groupWidth * 0.18;
    const innerWidth = groupWidth - barPad * 2;
    const barWidth = stacked ? innerWidth : innerWidth / Math.max(series.length, 1);

    return (
        <div className="chart-shell">
            <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
                {[0, 0.5, 1].map((ratio) => {
                    const y = padding.top + plotHeight - ratio * plotHeight;
                    return (
                        <g key={ratio}>
                            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--color-border)" strokeWidth="1" />
                            <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="var(--color-body)">
                                {Math.round(max * ratio)}
                            </text>
                        </g>
                    );
                })}
                {labels.map((label, index) => {
                    const groupX = padding.left + index * groupWidth;
                    let stackOffset = 0;
                    return (
                        <g key={`${label}-${index}`}>
                            <text x={groupX + groupWidth / 2} y={height - 10} textAnchor="middle" fontSize="11" fill="var(--color-body)">
                                {label}
                            </text>
                            {series.map((item, seriesIndex) => {
                                const value = Number(item.values?.[index]) || 0;
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
                                return (
                                    <rect key={item.id || item.name || seriesIndex} x={x} y={y} width={Math.max(barWidth - 2, 4)} height={Math.max(barHeight, 0)} fill={color} rx="2">
                                        <title>{`${item.name}: ${value} (${label})`}</title>
                                    </rect>
                                );
                            })}
                        </g>
                    );
                })}
            </svg>
            <ChartLegend series={series.map((item, index) => ({ ...item, color: item.color || chartColor(index) }))} />
        </div>
    );
}
