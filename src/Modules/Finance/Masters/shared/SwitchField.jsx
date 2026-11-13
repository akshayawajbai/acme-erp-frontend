export function SwitchField({ id, label, checked, onChange, disabled = false }) {
    return (
        <div className="field master-switch-field">
            <label htmlFor={id} className="master-switch">
                <input
                    id={id}
                    type="checkbox"
                    checked={Boolean(checked)}
                    disabled={disabled}
                    onChange={(event) => onChange(event.target.checked)}
                />
                <span className="master-switch__control" aria-hidden="true" />
                <span className="master-switch__label">{label}</span>
            </label>
        </div>
    );
}
