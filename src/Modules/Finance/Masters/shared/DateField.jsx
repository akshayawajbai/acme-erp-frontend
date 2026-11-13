export function DateField({
    id,
    label,
    value,
    onChange,
    error,
    disabled = false,
    required = false,
    min,
    max,
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
            <input
                id={id}
                className={error ? 'control is-invalid' : 'control'}
                type="date"
                value={value || ''}
                disabled={disabled}
                required={required}
                min={min}
                max={max}
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
