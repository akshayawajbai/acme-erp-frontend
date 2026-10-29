import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { LoadingSpinner } from './LoadingSpinner';

function classNames(...parts) {
    return parts.filter(Boolean).join(' ');
}

export function BaseCard({
    title,
    subtitle,
    headerActions,
    footer,
    children,
    variant = 'default',
    loading = false,
    empty = false,
    emptyTitle = 'Nothing to show',
    emptyMessage = 'There is no data for this card yet.',
    error = '',
    onRetry,
    onClick,
    className = '',
    'aria-label': ariaLabel,
}) {
    const interactive = typeof onClick === 'function';
    const classes = classNames(
        'base-card',
        variant === 'accent' && 'base-card--accent',
        variant === 'flat' && 'base-card--flat',
        variant === 'muted' && 'base-card--muted',
        interactive && 'is-clickable',
        loading && 'is-loading',
        Boolean(error) && 'is-error',
        empty && !loading && !error && 'is-empty',
        className,
    );

    const body = (() => {
        if (loading) {
            return (
                <div className="loading" role="status">
                    <LoadingSpinner />
                    <span className="sr-only">Loading</span>
                </div>
            );
        }
        if (error) {
            return <ErrorState message={error} onRetry={onRetry} />;
        }
        if (empty) {
            return <EmptyState title={emptyTitle} message={emptyMessage} />;
        }
        return children;
    })();

    const content = (
        <>
            {(title || subtitle || headerActions) ? (
                <div className="base-card__header">
                    <div>
                        {title ? <h2 className="base-card__title">{title}</h2> : null}
                        {subtitle ? <p className="base-card__subtitle">{subtitle}</p> : null}
                    </div>
                    {headerActions ? <div className="base-card__actions">{headerActions}</div> : null}
                </div>
            ) : null}
            <div className="base-card__body">{body}</div>
            {footer && !loading && !error ? <div className="base-card__footer">{footer}</div> : null}
        </>
    );

    if (interactive) {
        return (
            <article
                className={classes}
                aria-label={ariaLabel || title}
                role="button"
                tabIndex={0}
                onClick={onClick}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onClick(event);
                    }
                }}
            >
                {content}
            </article>
        );
    }

    return (
        <article className={classes} aria-label={ariaLabel || title}>
            {content}
        </article>
    );
}
