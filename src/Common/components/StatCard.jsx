import { BaseCard } from './BaseCard';

export function StatCard({
    title,
    value,
    subtitle,
    note,
    icon,
    trend,
    trendLabel,
    loading = false,
    error = '',
    onRetry,
    onClick,
    className = '',
    'aria-label': ariaLabel,
}) {
    const direction = trend === 'up' || trend === 'down' || trend === 'flat' ? trend : null;

    return (
        <BaseCard
            variant="accent"
            loading={loading}
            error={error}
            onRetry={onRetry}
            onClick={onClick}
            className={['stat-card', className].filter(Boolean).join(' ')}
            aria-label={ariaLabel || title}
        >
            <div className="stat-card__top">
                <div>
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
                </div>
                {icon ? <span className="stat-card__icon" aria-hidden="true">{icon}</span> : null}
            </div>
        </BaseCard>
    );
}
