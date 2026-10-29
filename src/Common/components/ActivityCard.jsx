import { BaseCard } from './BaseCard';

export function ActivityCard({
    title = 'Recent activity',
    subtitle,
    items = [],
    headerActions,
    footer,
    loading = false,
    error = '',
    onRetry,
    emptyTitle = 'No recent activity',
    emptyMessage = 'Activity will appear here when records are available.',
    className = '',
}) {
    return (
        <BaseCard
            title={title}
            subtitle={subtitle}
            headerActions={headerActions}
            footer={footer}
            loading={loading}
            empty={!loading && !error && items.length === 0}
            emptyTitle={emptyTitle}
            emptyMessage={emptyMessage}
            error={error}
            onRetry={onRetry}
            className={['activity-card', className].filter(Boolean).join(' ')}
        >
            <ul className="activity-card__list">
                {items.map((item) => (
                    <li key={item.id} className="activity-card__item">
                        <div>
                            <strong>{item.title}</strong>
                            {item.meta ? <div className="activity-card__meta">{item.meta}</div> : null}
                        </div>
                        {item.amount != null ? (
                            <div className={`activity-card__amount ${item.tone === 'in' ? 'amount-in' : item.tone === 'out' ? 'amount-out' : ''}`}>
                                {item.amount}
                            </div>
                        ) : null}
                    </li>
                ))}
            </ul>
        </BaseCard>
    );
}