import { useState } from 'react';
import { ChartTooltip } from './ChartTooltip';
import { ChartEmpty, ChartLegend, alignSeries, chartColor, formatChartNumber, seriesExtent } from './chartUtils';

export function LineChart({
    labels = [],
    series = [],
    height = 220,
    ariaLabel = 'Line chart',
    showArea = false,
    formatValue,
}) {
    const [activeIndex, setActiveIndex] = useState(null);
    const safeLabels = Array.isArray(labels) ? labels.filter((label) => label != null && String(label).length > 0) : [];
    const aligned = alignSeries(safeLabels, Array.isArray(series) ? series : []);

    if (!safeLabels.length || !aligned.length || aligned.every((item) => item.values.every((value) => value === 0))) {
        return <ChartEmpty />;
    }

    const width = 640;
    const padding = { top: 16, right: 16, bottom: 36, left: 52 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const max = seriesExtent(aligned);
    const step = safeLabels.length > 1 ? plotWidth / (safeLabels.length - 1) : 0;
    const formatAmount = typeof formatValue === 'function'
        ? formatValue
        : (amount) => formatChartNumber(amount);

    function point(index, value) {
        const x = safeLabels.length === 1
            ? padding.left + plotWidth / 2
            : padding.left + index * step;
        const y = padding.top + plotHeight - (value / max) * plotHeight;
        return { x, y };
    }

    return (
        <div className="chart-shell">
            <svg viewBox={`0 0 ${width} ${height}`} role="group" aria-label={ariaLabel}>
                <title>{ariaLabel}</title>
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
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
                {safeLabels.map((label, index) => (
                    <text
                        key={`${label}-${index}`}
                        x={point(index, 0).x}
                        y={height - 10}
                        textAnchor="middle"
                        fontSize="11"
                        fill="var(--color-body)"
                    >
                        {label}
                    </text>
                ))}
                {aligned.map((item, seriesIndex) => {
                    const color = item.color || chartColor(seriesIndex);
                    const points = item.values.map((value, index) => point(index, value));
                    const path = points.map((entry, index) => `${index === 0 ? 'M' : 'L'}${entry.x} ${entry.y}`).join(' ');
                    const areaPath = showArea && points.length
                        ? `${path} L${points[points.length - 1].x} ${padding.top + plotHeight} L${points[0].x} ${padding.top + plotHeight} Z`
                        : null;
                    return (
                        <g key={item.id}>
                            {areaPath ? <path d={areaPath} fill={color} opacity="0.16" /> : null}
                            <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                            {points.map((entry, index) => (
                                <circle
                                    key={index}
                                    cx={entry.x}
                                    cy={entry.y}
                                    r={activeIndex === index ? 5.5 : 3.5}
                                    fill={color}
                                    pointerEvents="none"
                                />
                            ))}
                        </g>
                    );
                })}
                {safeLabels.map((label, index) => {
                    const x = point(index, 0).x;
                    const band = safeLabels.length === 1 ? plotWidth : step;
                    const seriesText = aligned.map((item) => `${item.name} ${formatAmount(item.values[index])}`).join(', ');
                    return (
                        <rect
                            key={`hit-${label}-${index}`}
                            x={x - band / 2}
                            y={padding.top}
                            width={Math.max(band, 8)}
                            height={plotHeight}
                            fill="transparent"
                            tabIndex={0}
                            role="img"
                            aria-label={`${label}: ${seriesText}`}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                            onFocus={() => setActiveIndex(index)}
                            onBlur={() => setActiveIndex(null)}
                        />
                    );
                })}
            </svg>
            {activeIndex != null ? (
                <ChartTooltip x={(point(activeIndex, 0).x / width) * 100} y={18}>
                    <strong>{safeLabels[activeIndex]}</strong>
                    {aligned.map((item) => (
                        <span key={item.id}>{item.name}: {formatAmount(item.values[activeIndex])}</span>
                    ))}
                </ChartTooltip>
            ) : null}
            <ChartLegend series={aligned.map((item, index) => ({ ...item, color: item.color || chartColor(index) }))} />
        </div>
    );
}
