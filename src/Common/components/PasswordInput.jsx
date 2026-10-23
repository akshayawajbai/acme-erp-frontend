import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './Icons';
export function PasswordInput({ id, label, value, onChange, error, disabled = false, required = false, autoComplete = 'current-password', }) {
    const [visible, setVisible] = useState(false);
    const errorId = `${id}-error`;
    return (<div className="field">
      <label htmlFor={id}>
        {label}
        {required ? (<span className="req" aria-hidden="true">
            *
          </span>) : null}
      </label>
      <div className="password-field">
        <input id={id} className={error ? 'control is-invalid' : 'control'} type={visible ? 'text' : 'password'} value={value} disabled={disabled} required={required} autoComplete={autoComplete} aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined} onChange={(event) => onChange(event.target.value)}/>
        <button type="button" className="icon-button password-toggle" aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} disabled={disabled} onClick={() => setVisible((current) => !current)}>
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {error ? (<p className="field-error" id={errorId}>
          {error}
        </p>) : null}
    </div>);
}
