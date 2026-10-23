export function Input({ id, label, value, onChange, type = 'text', placeholder, error, disabled = false, required = false, autoComplete, clearable = false, }) {
    const errorId = `${id}-error`;
    return (<div className="field">
      <label htmlFor={id}>
        {label}
        {required ? (<span className="req" aria-hidden="true">
            *
          </span>) : null}
      </label>
      <div className={clearable ? 'input-clearable' : undefined}>
        <input id={id} className={error ? 'control is-invalid' : 'control'} type={type} value={value} placeholder={placeholder} disabled={disabled} required={required} autoComplete={autoComplete} aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined} onChange={(event) => onChange(event.target.value)}/>
        {clearable && value ? (<button type="button" className="field-clear" aria-label={`Clear ${label}`} onClick={() => onChange('')}>
            Clear
          </button>) : null}
      </div>
      {error ? (<p className="field-error" id={errorId}>
          {error}
        </p>) : null}
    </div>);
}
