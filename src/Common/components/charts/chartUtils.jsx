export function chartColor(index) {
    return `var(--chart-${(index % 6) + 1})`;
}

export function toFiniteNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
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

export function alignSeries(labels = [], series = []) {
    const length = labels.length;
    return series.map((item, index) => {
        const values = Array.isArray(item?.values) ? item.values : [];
        const aligned = Array.from({ length }, (_, valueIndex) => {
            if (valueIndex >= values.length) {
                return 0;
            }
            return Math.max(0, toFiniteNumber(values[valueIndex], 0));
        });
        return {
            id: item?.id || item?.name || `series-${index}`,
            name: item?.name || `Series ${index + 1}`,
            color: item?.color,
            values: aligned,
        };
    });
}

export function seriesExtent(series = []) {
    let max = 0;
    series.forEach((item) => {
        const values = Array.isArray(item.values) ? item.values : [];
        values.forEach((value) => {
            const number = toFiniteNumber(value, 0);
            if (number > max) {
                max = number;
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
    return <div className="chart-empty" role="status">{message}</div>;
}

export function formatChartNumber(value) {
    const number = toFiniteNumber(value, 0);
    if (Math.abs(number) >= 1000) {
        return new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(number);
    }
    return String(Math.round(number));
}
