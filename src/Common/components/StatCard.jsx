import { BaseCard } from './BaseCard';

export function StatCard({
    title,
    value,
    subtitle,
    note,
    icon,
    trend,
    trendLabel,
    detail = '',
    loading = false,
    error = '',
    onRetry,
    onClick,
    className = '',
    tone,
    'aria-label': ariaLabel,
}) {
    const direction = trend === 'up' || trend === 'down' || trend === 'flat' ? trend : null;
    const isMetric = tone === 'metric';
    const toneClass = tone === 'figure' || tone === 'balance' || tone === 'metric'
        ? `stat-card--${tone}`
        : '';
    const detailLabel = detail ? `${title}. ${value}. ${detail}` : undefined;

    return (
        <BaseCard
            variant="default"
            loading={loading}
            error={error}
            onRetry={onRetry}
            onClick={onClick}
            className={['stat-card', toneClass, className].filter(Boolean).join(' ')}
            aria-label={ariaLabel || title}
        >
            {isMetric ? (
                <div className="stat-card__metric" tabIndex={detail ? 0 : undefined} aria-label={detailLabel}>
                    {icon ? <span className="stat-card__icon" aria-hidden="true">{icon}</span> : null}
                    <h3 className="stat-card__label">{title}</h3>
                    <p className="stat-card__value">{value}</p>
                    {subtitle ? <span className="stat-card__note">{subtitle}</span> : null}
                    {note ? <span className="stat-card__note">{note}</span> : null}
                    {direction && trendLabel ? (
                        <span className={`stat-card__trend is-${direction}`}>
                            {direction === 'up' ? '▲' : direction === 'down' ? '▼' : '●'}
                            {' '}
                            {trendLabel}
                        </span>
                    ) : null}
                    {detail ? (
                        <p className="stat-card__tooltip" role="tooltip">
                            <strong>{title}</strong>
                            <span>{value}</span>
                            {detail}
                        </p>
                    ) : null}
                </div>
            ) : (
                <div className="stat-card__top" tabIndex={detail ? 0 : undefined} aria-label={detailLabel}>
                    <div>
                        <h3 className="stat-card__label">{title}</h3>
                        <p className="stat-card__value">{value}</p>
                        {subtitle ? <span className="stat-card__note">{subtitle}</span> : null}
                        {note ? <span className="stat-card__note">{note}</span> : null}
                        {detail ? (
                            <p className="stat-card__tooltip" role="tooltip">
                                <strong>{title}</strong>
                                <span>{value}</span>
                                {detail}
                            </p>
                        ) : null}
                        {direction && trendLabel ? (
                            <span className={`stat-card__trend is-${direction}`}>
                                {direction === 'up' ? '▲' : direction === 'down' ? '▼' : '●'}
                                {' '}
                                {trendLabel}
                            </span>
                        ) : null}
                    </div>
                    {icon ? <span className="stat-card__icon" aria-hidden="true">{icon}</span> : null}
                </div>
            )}
        </BaseCard>
    );
}
