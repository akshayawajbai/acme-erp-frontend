import { Link } from 'react-router-dom';
import { BaseCard } from './BaseCard';

export function ActionCard({
    title = 'Quick actions',
    subtitle,
    actions = [],
    loading = false,
    error = '',
    onRetry,
    className = '',
}) {
    return (
        <BaseCard
            title={title}
            subtitle={subtitle}
            loading={loading}
            empty={!loading && !error && actions.length === 0}
            emptyTitle="No quick actions"
            emptyMessage="Actions will appear here when available."
            error={error}
            onRetry={onRetry}
            className={['action-card', className].filter(Boolean).join(' ')}
        >
            <div className="action-card__list">
                {actions.map((action) => {
                    if (action.path) {
                        return (
                            <Link key={action.id || action.path || action.label} className="btn btn-outline btn-small" to={action.path}>
                                {action.label}
                            </Link>
                        );
                    }
                    return (
                        <button
                            key={action.id || action.label}
                            type="button"
                            className="btn btn-outline btn-small"
                            onClick={action.onClick}
                            disabled={action.disabled}
                        >
                            {action.label}
                        </button>
                    );
                })}
            </div>
        </BaseCard>
    );
}
