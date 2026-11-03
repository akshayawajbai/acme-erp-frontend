import { useState } from 'react';
import { ChartTooltip } from './ChartTooltip';
import { ChartEmpty, ChartLegend, alignSeries, chartColor, formatChartNumber, seriesExtent } from './chartUtils';

export function BarChart({
    labels = [],
    series = [],
    height = 220,
    stacked = false,
    ariaLabel = 'Bar chart',
    formatValue,
}) {
    const [activeKey, setActiveKey] = useState(null);
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
    const formatAmount = typeof formatValue === 'function'
        ? formatValue
        : (amount) => formatChartNumber(amount);
    const active = activeKey
        ? aligned.flatMap((item) => item.values.map((value, index) => ({
            key: `${item.id}-${index}`,
            name: item.name,
            label: safeLabels[index],
            value,
            x: padding.left + index * groupWidth + groupWidth / 2,
        }))).find((item) => item.key === activeKey)
        : null;

    return (
        <div className="chart-shell">
            <svg viewBox={`0 0 ${width} ${height}`} role="group" aria-label={ariaLabel}>
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
                                const key = `${item.id}-${index}`;
                                return (
                                    <rect
                                        key={item.id}
                                        x={x}
                                        y={y}
                                        width={Math.max(barWidth - (stacked ? 0 : 2), 2)}
                                        height={barHeight}
                                        fill={color}
                                        rx="2"
                                        opacity={activeKey && activeKey !== key ? 0.55 : 1}
                                        tabIndex={0}
                                        role="img"
                                        aria-label={`${item.name}, ${label}, ${formatAmount(value)}`}
                                        onMouseEnter={() => setActiveKey(key)}
                                        onMouseLeave={() => setActiveKey(null)}
                                        onFocus={() => setActiveKey(key)}
                                        onBlur={() => setActiveKey(null)}
                                    />
                                );
                            })}
                        </g>
                    );
                })}
            </svg>
            {active ? (
                <ChartTooltip x={(active.x / width) * 100} y={16}>
                    <strong>{active.label}</strong>
                    <span>{active.name}: {formatAmount(active.value)}</span>
                </ChartTooltip>
            ) : null}
            <ChartLegend series={aligned.map((item, index) => ({ ...item, color: item.color || chartColor(index) }))} />
        </div>
    );
}
