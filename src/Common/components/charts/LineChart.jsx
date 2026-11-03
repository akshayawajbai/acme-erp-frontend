import { useEffect, useId, useState } from 'react';
import { ChartTooltip } from './ChartTooltip';
import { ChartEmpty, ChartLegend, alignSeries, chartColor, formatChartNumber, seriesExtent } from './chartUtils';

function prefersReducedMotion() {
    return typeof window !== 'undefined'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function lineDataKey(labels, series) {
    const safeLabels = Array.isArray(labels) ? labels.filter((label) => label != null && String(label).length > 0) : [];
    const aligned = alignSeries(safeLabels, Array.isArray(series) ? series : []);
    return JSON.stringify({
        labels: safeLabels,
        series: aligned.map((item) => ({ id: item.id, values: item.values })),
    });
}

export function LineChart({
    labels = [],
    series = [],
    height = 220,
    frameWidth = 640,
    ariaLabel = 'Line chart',
    showArea = false,
    formatValue,
}) {
    const [activeIndex, setActiveIndex] = useState(null);
    const [reveal, setReveal] = useState(() => (prefersReducedMotion() ? 1 : 0));
    const clipId = useId().replace(/:/g, '');
    const safeLabels = Array.isArray(labels) ? labels.filter((label) => label != null && String(label).length > 0) : [];
    const aligned = alignSeries(safeLabels, Array.isArray(series) ? series : []);
    const dataKey = lineDataKey(labels, series);

    useEffect(() => {
        if (!safeLabels.length || !aligned.length) {
            return undefined;
        }
        if (prefersReducedMotion()) {
            setReveal(1);
            return undefined;
        }
        setReveal(0);
        const start = performance.now();
        const duration = 850;
        let frame = 0;
        function tick(now) {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - ((1 - progress) ** 3);
            setReveal(eased);
            if (progress < 1) {
                frame = requestAnimationFrame(tick);
            }
        }
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
        // Replay only when the meaningful dataset signature changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps -- dataKey encodes labels/series values
    }, [dataKey]);

    if (!safeLabels.length || !aligned.length || aligned.every((item) => item.values.every((value) => value === 0))) {
        return <ChartEmpty />;
    }

    const width = frameWidth;
    const padding = { top: 18, right: 18, bottom: 40, left: 56 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const max = seriesExtent(aligned);
    const step = safeLabels.length > 1 ? plotWidth / (safeLabels.length - 1) : 0;
    const formatAmount = typeof formatValue === 'function'
        ? formatValue
        : (amount) => formatChartNumber(amount);
    const revealWidth = Math.max(0, plotWidth * reveal);

    function point(index, value) {
        const x = safeLabels.length === 1
            ? padding.left + plotWidth / 2
            : padding.left + index * step;
        const y = padding.top + plotHeight - (value / max) * plotHeight;
        return { x, y };
    }

    const activeX = activeIndex != null ? point(activeIndex, 0).x : null;

    return (
        <div className="chart-shell chart-shell--line">
            <svg viewBox={`0 0 ${width} ${height}`} role="group" aria-label={ariaLabel}>
                <title>{ariaLabel}</title>
                <defs>
                    <clipPath id={clipId}>
                        <rect
                            x={padding.left}
                            y={padding.top - 8}
                            width={revealWidth}
                            height={plotHeight + 16}
                        />
                    </clipPath>
                </defs>
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = padding.top + plotHeight - ratio * plotHeight;
                    return (
                        <g key={ratio}>
                            <line
                                x1={padding.left}
                                y1={y}
                                x2={width - padding.right}
                                y2={y}
                                stroke="var(--color-border)"
                                strokeWidth="1"
                                opacity={ratio === 0 ? 1 : 0.55}
                            />
                            <text
                                x={padding.left - 10}
                                y={y + 4}
                                textAnchor="end"
                                fontSize="11"
                                fill="var(--color-body)"
                                style={{ fontVariantNumeric: 'tabular-nums' }}
                            >
                                {formatChartNumber(max * ratio)}
                            </text>
                        </g>
                    );
                })}
                {safeLabels.map((label, index) => (
                    <text
                        key={`${label}-${index}`}
                        x={point(index, 0).x}
                        y={height - 12}
                        textAnchor="middle"
                        fontSize="12"
                        fill="var(--color-body)"
                    >
                        {label}
                    </text>
                ))}
                {activeX != null ? (
                    <line
                        x1={activeX}
                        y1={padding.top}
                        x2={activeX}
                        y2={padding.top + plotHeight}
                        stroke="var(--color-primary)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        opacity="0.45"
                        pointerEvents="none"
                    />
                ) : null}
                <g clipPath={`url(#${clipId})`}>
                    {aligned.map((item, seriesIndex) => {
                        const color = item.color || chartColor(seriesIndex);
                        const points = item.values.map((value, index) => point(index, value));
                        const path = points.map((entry, index) => `${index === 0 ? 'M' : 'L'}${entry.x} ${entry.y}`).join(' ');
                        const areaPath = showArea && points.length
                            ? `${path} L${points[points.length - 1].x} ${padding.top + plotHeight} L${points[0].x} ${padding.top + plotHeight} Z`
                            : null;
                        const isExpenseLine = item.fill === false;
                        return (
                            <g key={item.id}>
                                {areaPath && !isExpenseLine ? <path d={areaPath} fill={color} opacity="0.12" /> : null}
                                <path
                                    d={path}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth={isExpenseLine ? 2 : 2.4}
                                    strokeDasharray={isExpenseLine ? '6 5' : undefined}
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                />
                                {points.map((entry, index) => {
                                    const active = activeIndex === index;
                                    return (
                                        <g key={index} pointerEvents="none">
                                            {active ? (
                                                <circle
                                                    cx={entry.x}
                                                    cy={entry.y}
                                                    r="7"
                                                    fill="var(--color-surface)"
                                                    stroke={color}
                                                    strokeWidth="2"
                                                />
                                            ) : null}
                                            <circle
                                                cx={entry.x}
                                                cy={entry.y}
                                                r={active ? 4 : 3}
                                                fill={color}
                                            />
                                        </g>
                                    );
                                })}
                            </g>
                        );
                    })}
                </g>
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
                <ChartTooltip x={(point(activeIndex, 0).x / width) * 100} y={14}>
                    <strong>{safeLabels[activeIndex]}</strong>
                    {aligned.map((item) => (
                        <span key={item.id} className="chart-tooltip__row">
                            <span className="chart-tooltip__swatch" style={{ background: item.color || chartColor(0) }} aria-hidden="true" />
                            {item.name}
                            {' '}
                            <b>{formatAmount(item.values[activeIndex])}</b>
                        </span>
                    ))}
                </ChartTooltip>
            ) : null}
            <ChartLegend series={aligned.map((item, index) => ({ ...item, color: item.color || chartColor(index) }))} />
        </div>
    );
}
