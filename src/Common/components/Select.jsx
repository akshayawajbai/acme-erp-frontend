export function Select({ id, label, value, options, onChange, placeholder = 'Select', error, disabled = false, required = false, hidePlaceholder = false, }) {
    const errorId = `${id}-error`;
    return (<div className="field">
      <label htmlFor={id}>
        {label}
        {required ? (<span className="req" aria-hidden="true">
            *
          </span>) : null}
      </label>
      <select id={id} className={error ? 'control is-invalid' : 'control'} value={value} disabled={disabled} required={required} aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined} onChange={(event) => onChange(event.target.value)}>
        {hidePlaceholder ? null : <option value="">{placeholder}</option>}
        {options.map((option) => (<option key={option.value} value={option.value}>
            {option.label}
          </option>))}
      </select>
      {error ? (<p className="field-error" id={errorId}>
          {error}
        </p>) : null}
    </div>);
}
