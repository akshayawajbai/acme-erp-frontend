export function ProgressGauge({
    value = 0,
    max = 100,
    label = '',
    formatValue,
    ariaLabel = 'Progress',
}) {
    const safeMax = max > 0 ? max : 1;
    const clamped = Math.max(0, Math.min(Number(value) || 0, safeMax));
    const percent = Math.round((clamped / safeMax) * 100);
    const display = typeof formatValue === 'function' ? formatValue(clamped, percent) : `${percent}%`;

    return (
        <div className="progress-gauge" role="img" aria-label={`${ariaLabel}: ${display}`}>
            {label ? <div className="progress-gauge__meta"><span>{label}</span><strong>{display}</strong></div> : null}
            <div className="progress-gauge__track" aria-hidden="true">
                <div className="progress-gauge__fill" style={{ width: `${percent}%` }} />
            </div>
            {!label ? <div className="progress-gauge__meta"><span>{display}</span></div> : null}
        </div>
    );
}
