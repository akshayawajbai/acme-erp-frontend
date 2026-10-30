import { ChartEmpty, ChartLegend, chartColor, toFiniteNumber } from './chartUtils';

export function PieChart({
    segments = [],
    size = 180,
    donut = false,
    ariaLabel = 'Pie chart',
}) {
    const cleaned = (Array.isArray(segments) ? segments : [])
        .map((segment, index) => ({
            id: segment?.id || segment?.name || `segment-${index}`,
            name: segment?.name || `Segment ${index + 1}`,
            value: Math.max(0, toFiniteNumber(segment?.value, 0)),
            color: segment?.color,
        }))
        .filter((segment) => segment.value > 0);

    const total = cleaned.reduce((sum, item) => sum + item.value, 0);
    if (!cleaned.length || total <= 0) {
        return <ChartEmpty />;
    }

    const radius = size / 2;
    const inner = donut ? radius * 0.58 : 0;
    let angle = -Math.PI / 2;

    const paths = cleaned.map((segment, index) => {
        const value = segment.value;
        const sweep = (value / total) * Math.PI * 2;
        const start = angle;
        const end = angle + sweep;
        angle = end;
        const color = segment.color || chartColor(index);

        // Full-circle arcs collapse to a point in SVG; use an explicit circle/ring instead.
        if (cleaned.length === 1 || sweep >= Math.PI * 2 - 1e-6) {
            return {
                id: segment.id,
                full: true,
                color,
                name: segment.name,
                value,
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

        return {
            id: segment.id,
            d,
            color,
            name: segment.name,
            value,
        };
    });

    const legend = cleaned.map((segment, index) => ({
        ...segment,
        color: segment.color || chartColor(index),
    }));

    return (
        <div className={donut ? 'donut-chart' : 'chart-shell'}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={ariaLabel}>
                <title>{ariaLabel}</title>
                {paths.map((path) => (
                    path.full ? (
                        <g key={path.id}>
                            <circle cx={radius} cy={radius} r={radius} fill={path.color}>
                                <title>{`${path.name}: ${path.value}`}</title>
                            </circle>
                            {donut ? <circle cx={radius} cy={radius} r={inner} fill="var(--card-bg, var(--color-surface))" /> : null}
                        </g>
                    ) : (
                        <path key={path.id} d={path.d} fill={path.color}>
                            <title>{`${path.name}: ${path.value}`}</title>
                        </path>
                    )
                ))}
                {donut ? (
                    <text x={radius} y={radius} textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="700" fill="var(--color-text)">
                        {Math.round(total)}
                    </text>
                ) : null}
            </svg>
            <ChartLegend series={legend} />
        </div>
    );
}
