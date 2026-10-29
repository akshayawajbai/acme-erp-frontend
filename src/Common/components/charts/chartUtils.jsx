export function chartColor(index) {
    return `var(--chart-${(index % 6) + 1})`;
}

export function niceMax(value) {
    if (!Number.isFinite(value) || value <= 0) {
        return 1;
    }
    const magnitude = 10 ** Math.floor(Math.log10(value));
    const normalized = value / magnitude;
    const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
    return nice * magnitude;
}

export function seriesExtent(series = []) {
    let max = 0;
    series.forEach((item) => {
        const values = Array.isArray(item.values) ? item.values : [];
        values.forEach((value) => {
            if (Number.isFinite(value) && value > max) {
                max = value;
            }
        });
    });
    return niceMax(max);
}

export function ChartLegend({ series = [] }) {
    if (!series.length) {
        return null;
    }
    return (
        <div className="chart-legend" aria-hidden="true">
            {series.map((item, index) => (
                <span key={item.id || item.name || index}>
                    <span className="chart-legend__swatch" style={{ background: item.color || chartColor(index) }} />
                    {item.name}
                </span>
            ))}
        </div>
    );
}

export function ChartEmpty({ message = 'No data available for this chart.' }) {
    return <div className="chart-empty">{message}</div>;
}
