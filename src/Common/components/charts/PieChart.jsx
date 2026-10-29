import { ChartEmpty, ChartLegend, chartColor } from './chartUtils';

export function PieChart({
    segments = [],
    size = 180,
    donut = false,
    ariaLabel = 'Pie chart',
}) {
    const total = segments.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
    if (!segments.length || total <= 0) {
        return <ChartEmpty />;
    }

    const radius = size / 2;
    const inner = donut ? radius * 0.58 : 0;
    let angle = -Math.PI / 2;

    const paths = segments.map((segment, index) => {
        const value = Number(segment.value) || 0;
        const sweep = (value / total) * Math.PI * 2;
        const start = angle;
        const end = angle + sweep;
        angle = end;
        const large = sweep > Math.PI ? 1 : 0;
        const x1 = radius + Math.cos(start) * radius;
        const y1 = radius + Math.sin(start) * radius;
        const x2 = radius + Math.cos(end) * radius;
        const y2 = radius + Math.sin(end) * radius;
        const ix1 = radius + Math.cos(end) * inner;
        const iy1 = radius + Math.sin(end) * inner;
        const ix2 = radius + Math.cos(start) * inner;
        const iy2 = radius + Math.sin(start) * inner;
        const color = segment.color || chartColor(index);
        const d = donut
            ? `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${inner} ${inner} 0 ${large} 0 ${ix2} ${iy2} Z`
            : `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
        return {
            id: segment.id || segment.name || index,
            d,
            color,
            name: segment.name,
            value,
        };
    });

    const legend = segments.map((segment, index) => ({
        ...segment,
        color: segment.color || chartColor(index),
    }));

    return (
        <div className={donut ? 'donut-chart' : 'chart-shell'}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={ariaLabel}>
                {paths.map((path) => (
                    <path key={path.id} d={path.d} fill={path.color}>
                        <title>{`${path.name}: ${path.value}`}</title>
                    </path>
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
