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
            <div className="shortcut-row">
                {actions.map((action) => {
                    const Icon = action.icon;
                    const key = action.id || action.path || action.label;
                    const content = (
                        <>
                            {Icon ? <Icon /> : null}
                            <span>{action.label}</span>
                        </>
                    );
                    if (action.path) {
                        return (
                            <Link key={key} className="shortcut" to={action.path}>
                                {content}
                            </Link>
                        );
                    }
                    return (
                        <button
                            key={key}
                            type="button"
                            className="shortcut"
                            onClick={action.onClick}
                            disabled={action.disabled}
                        >
                            {content}
                        </button>
                    );
                })}
            </div>
        </BaseCard>
    );
}
