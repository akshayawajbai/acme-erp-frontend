import { BaseCard } from './BaseCard';

export function ChartCard({
    title,
    subtitle,
    headerActions,
    footer,
    children,
    loading = false,
    empty = false,
    emptyTitle = 'No chart data',
    emptyMessage = 'There is nothing to plot for this period.',
    error = '',
    onRetry,
    className = '',
}) {
    return (
        <BaseCard
            title={title}
            subtitle={subtitle}
            headerActions={headerActions}
            footer={footer}
            loading={loading}
            empty={empty}
            emptyTitle={emptyTitle}
            emptyMessage={emptyMessage}
            error={error}
            onRetry={onRetry}
            className={['chart-card', className].filter(Boolean).join(' ')}
        >
            {children}
        </BaseCard>
    );
}
