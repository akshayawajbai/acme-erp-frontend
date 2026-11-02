/**
 * Isolated Tailwind utility verification panel.
 * Shown only in development builds so production pages stay unchanged.
 */
export function TailwindSmokeTest() {
    return (
        <aside
            className="mt-4 rounded-lg border border-border bg-surface p-4 text-text shadow-sm"
            aria-label="Tailwind CSS smoke test"
            data-tailwind-smoke-test="true"
        >
            <p className="mb-3 font-manrope text-sm font-semibold text-header">
                Tailwind smoke test (dev only)
            </p>
            <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded bg-primary px-3 py-1 text-sm text-on-primary">
                    bg-primary
                </span>
                <span className="rounded bg-primary-soft px-3 py-1 text-sm text-primary">
                    primary-soft
                </span>
                <span className="rounded border border-border bg-background px-3 py-1 text-sm text-body">
                    body / background
                </span>
                <span className="rounded bg-white px-3 py-1 text-sm text-charcoal dark:bg-surface-muted dark:text-text">
                    white / dark:surface-muted
                </span>
            </div>
            <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                <div className="rounded border border-border bg-background p-2 text-center text-xs text-body">
                    grid 1
                </div>
                <div className="rounded border border-border bg-background p-2 text-center text-xs text-body">
                    grid 2
                </div>
                <div className="hidden rounded border border-border bg-background p-2 text-center text-xs text-body md:block">
                    md:visible
                </div>
                <div className="rounded border border-border bg-background p-2 text-center text-xs text-body hover:border-primary hover:bg-primary-soft">
                    hover
                </div>
            </div>
            <p className="m-0 text-xs text-body dark:text-warning">
                Light uses body text. Dark mode switches this line to warning via dark: utilities.
            </p>
        </aside>
    );
}
