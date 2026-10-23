export function Button({ variant = 'primary', size = 'medium', loading = false, disabled = false, icon, type = 'button', className, children, ...rest }) {
    const classes = ['btn', `btn-${variant}`, `btn-${size}`, loading ? 'is-loading' : '', className]
        .filter(Boolean)
        .join(' ');
    return (<button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <span className="btn-spinner" aria-hidden="true"/> : null}
      {icon}
      <span>{children}</span>
    </button>);
}
