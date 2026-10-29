import { BaseCard } from './BaseCard';
import { StatusBadge } from './StatusBadge';

export function StatusCard({
    title,
    status,
    message,
    footer,
    loading = false,
    error = '',
    onRetry,
    className = '',
}) {
    return (
        <BaseCard
            title={title}
            footer={footer}
            loading={loading}
            error={error}
            onRetry={onRetry}
            className={['status-card', className].filter(Boolean).join(' ')}
        >
            <div className="status-card__row">
                <p className="status-card__message">{message}</p>
                {status ? <StatusBadge status={status} /> : null}
            </div>
        </BaseCard>
    );
}
