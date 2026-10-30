import { toFiniteNumber } from './chartUtils';

export function ProgressGauge({
    value = 0,
    max = 100,
    label = '',
    formatValue,
    ariaLabel = 'Progress',
}) {
    const safeMax = Math.max(toFiniteNumber(max, 0), 0);
    const rawValue = toFiniteNumber(value, 0);
    const clamped = safeMax > 0 ? Math.max(0, Math.min(rawValue, safeMax)) : 0;
    const percent = safeMax > 0 ? Math.round((clamped / safeMax) * 100) : 0;
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