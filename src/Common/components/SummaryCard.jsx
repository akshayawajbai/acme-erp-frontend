import { StatCard } from './StatCard';

/**
 * Backward-compatible summary card used across the ERP.
 * New call sites can use StatCard directly for richer options.
 */
export function SummaryCard({ label, value, note, title, subtitle, icon, trend, trendLabel, loading, error, onRetry, onClick, className }) {
    return (
        <StatCard
            title={title || label}
            value={value}
            subtitle={subtitle}
            note={note}
            icon={icon}
            trend={trend}
            trendLabel={trendLabel}
            loading={loading}
            error={error}
            onRetry={onRetry}
            onClick={onClick}
            className={['summary-card', className].filter(Boolean).join(' ')}
        />
    );
}
