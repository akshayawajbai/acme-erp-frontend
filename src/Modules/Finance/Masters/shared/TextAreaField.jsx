export function TextAreaField({
    id,
    label,
    value,
    onChange,
    placeholder,
    error,
    disabled = false,
    required = false,
    rows = 3,
}) {
    const errorId = `${id}-error`;
    return (
        <div className="field">
            <label htmlFor={id}>
                {label}
                {required ? (
                    <span className="req" aria-hidden="true">
                        *
                    </span>
                ) : null}
            </label>
            <textarea
                id={id}
                className={error ? 'control is-invalid' : 'control'}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                rows={rows}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                onChange={(event) => onChange(event.target.value)}
            />
            {error ? (
                <p className="field-error" id={errorId}>
                    {error}
                </p>
            ) : null}
        </div>
    );
}
