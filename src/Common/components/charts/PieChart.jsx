import { useEffect, useId, useState } from 'react';
import { ChartTooltip } from './ChartTooltip';
import { ChartEmpty, ChartLegend, chartColor, formatChartNumber, toFiniteNumber } from './chartUtils';

function formatShare(value, total) {
    if (!total) {
        return '0%';
    }
    const share = (value / total) * 100;
    const digits = Number.isInteger(share) ? 0 : 1;
    return `${share.toFixed(digits)}%`;
}

function prefersReducedMotion() {
    return typeof window !== 'undefined'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function pieDataKey(segments) {
    return (Array.isArray(segments) ? segments : [])
        .map((segment, index) => {
            const id = segment?.id || segment?.name || `segment-${index}`;
            const value = Math.max(0, toFiniteNumber(segment?.value, 0));
            return `${id}:${value}`;
        })
        .filter((entry) => !entry.endsWith(':0'))
        .join('|');
}

export function PieChart({
    segments = [],
    size = 180,
    donut = false,
    ariaLabel = 'Pie chart',
    formatValue,
}) {
    const [activeId, setActiveId] = useState(null);
    const [revealReady, setRevealReady] = useState(false);
    const maskId = `pie-mask-${useId().replace(/:/g, '')}`;
    const cleaned = (Array.isArray(segments) ? segments : [])
        .map((segment, index) => ({
            id: segment?.id || segment?.name || `segment-${index}`,
            name: segment?.name || `Segment ${index + 1}`,
            value: Math.max(0, toFiniteNumber(segment?.value, 0)),
            color: segment?.color,
        }))
        .filter((segment) => segment.value > 0);

    const total = cleaned.reduce((sum, item) => sum + item.value, 0);
    const dataKey = pieDataKey(segments);

    useEffect(() => {
        if (!cleaned.length || total <= 0) {
            return undefined;
        }
        if (prefersReducedMotion()) {
            setRevealReady(false);
            return undefined;
        }
        setRevealReady(false);
        const frame = requestAnimationFrame(() => setRevealReady(true));
        return () => cancelAnimationFrame(frame);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- dataKey encodes segment values
    }, [dataKey]);

    if (!cleaned.length || total <= 0) {
        return <ChartEmpty />;
    }

    const radius = size / 2;
    const inner = donut ? radius * 0.62 : 0;
    let angle = -Math.PI / 2;
    const gap = cleaned.length > 1 ? 0.035 : 0;
    const reduceMotion = prefersReducedMotion();
    const maskRadius = donut ? (radius + inner) / 2 : radius * 0.5;
    const maskCircumference = 2 * Math.PI * maskRadius;

    const paths = cleaned.map((segment, index) => {
        const value = segment.value;
        const sweep = Math.max((value / total) * Math.PI * 2 - gap, 0.01);
        const start = angle + gap / 2;
        const end = start + sweep;
        angle += (value / total) * Math.PI * 2;
        const color = segment.color || chartColor(index);

        if (cleaned.length === 1 || sweep >= Math.PI * 2 - 1e-6) {
            return {
                id: segment.id,
                full: true,
                color,
                name: segment.name,
                value,
                tipX: radius,
                tipY: radius * 0.28,
            };
        }

        const large = sweep > Math.PI ? 1 : 0;
        const x1 = radius + Math.cos(start) * radius;
        const y1 = radius + Math.sin(start) * radius;
        const x2 = radius + Math.cos(end) * radius;
        const y2 = radius + Math.sin(end) * radius;
        const ix1 = radius + Math.cos(end) * inner;
        const iy1 = radius + Math.sin(end) * inner;
        const ix2 = radius + Math.cos(start) * inner;
        const iy2 = radius + Math.sin(start) * inner;
        const d = donut
            ? `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${inner} ${inner} 0 ${large} 0 ${ix2} ${iy2} Z`
            : `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
        const mid = start + sweep / 2;
        const tipRadius = donut ? (radius + inner) / 2 : radius * 0.62;

        return {
            id: segment.id,
            d,
            color,
            name: segment.name,
            value,
            tipX: radius + Math.cos(mid) * tipRadius,
            tipY: radius + Math.sin(mid) * tipRadius,
        };
    });

    const legend = cleaned.map((segment, index) => ({
        ...segment,
        color: segment.color || chartColor(index),
    }));
    const active = paths.find((path) => path.id === activeId) || null;
    const formatAmount = typeof formatValue === 'function'
        ? formatValue
        : (amount) => String(Math.round(amount));
    const tooltipX = active
        ? Math.min(88, Math.max(12, (active.tipX / size) * 100))
        : 50;
    const tooltipY = active
        ? Math.min(78, Math.max(8, (active.tipY / size) * 100))
        : 50;

    function segmentHandlers(id) {
        return {
            onMouseEnter: () => setActiveId(id),
            onMouseLeave: () => setActiveId(null),
            onFocus: () => setActiveId(id),
            onBlur: () => setActiveId(null),
            onMouseDown: (event) => {
                event.preventDefault();
            },
        };
    }

    return (
        <div className={donut ? 'donut-chart chart-shell' : 'chart-shell'}>
            <div className="donut-chart__plot">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="group" aria-label={ariaLabel}>
                    <title>{ariaLabel}</title>
                    <defs>
                        <mask id={maskId}>
                            <circle
                                cx={radius}
                                cy={radius}
                                r={maskRadius}
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth={radius}
                                strokeDasharray={maskCircumference}
                                strokeDashoffset={reduceMotion || !revealReady ? 0 : maskCircumference}
                                className={!reduceMotion && revealReady ? 'pie-reveal-stroke' : undefined}
                                transform={`rotate(-90 ${radius} ${radius})`}
                            />
                        </mask>
                    </defs>
                    <g mask={`url(#${maskId})`}>
                        {paths.map((path) => {
                            const label = `${path.name}, ${formatAmount(path.value)}, ${formatShare(path.value, total)} of this chart`;
                            const dimmed = activeId && activeId !== path.id;
                            return path.full ? (
                                <g key={path.id}>
                                    <circle
                                        className="pie-segment"
                                        cx={radius}
                                        cy={radius}
                                        r={radius}
                                        fill={path.color}
                                        opacity={dimmed ? 0.4 : 1}
                                        tabIndex={0}
                                        role="img"
                                        aria-label={label}
                                        {...segmentHandlers(path.id)}
                                    />
                                    {donut ? <circle cx={radius} cy={radius} r={inner} fill="var(--card-bg, var(--color-surface))" pointerEvents="none" /> : null}
                                </g>
                            ) : (
                                <path
                                    key={path.id}
                                    className="pie-segment"
                                    d={path.d}
                                    fill={path.color}
                                    opacity={dimmed ? 0.4 : 1}
                                    stroke={activeId === path.id ? 'var(--color-surface)' : 'var(--card-bg, var(--color-surface))'}
                                    strokeWidth={activeId === path.id ? 2 : 1}
                                    tabIndex={0}
                                    role="img"
                                    aria-label={label}
                                    {...segmentHandlers(path.id)}
                                />
                            );
                        })}
                    </g>
                    {donut ? (
                        <g pointerEvents="none">
                            <text
                                x={radius}
                                y={radius - 8}
                                textAnchor="middle"
                                fontSize="11"
                                fill="var(--color-body)"
                            >
                                Total
                            </text>
                            <text
                                x={radius}
                                y={radius + 12}
                                textAnchor="middle"
                                fontSize="15"
                                fontWeight="700"
                                fill="var(--color-text)"
                                style={{ fontVariantNumeric: 'tabular-nums' }}
                            >
                                {formatChartNumber(total)}
                            </text>
                        </g>
                    ) : null}
                </svg>
                {active ? (
                    <ChartTooltip x={tooltipX} y={tooltipY}>
                        <strong>{active.name}</strong>
                        <span>{formatAmount(active.value)}</span>
                        <span>{formatShare(active.value, total)} of this chart</span>
                    </ChartTooltip>
                ) : null}
            </div>
            <ChartLegend series={legend} />
        </div>
    );
}
