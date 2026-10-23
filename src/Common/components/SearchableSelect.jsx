import { useEffect, useId, useRef, useState } from 'react';
export function SearchableSelect({ id, label, value, options, onChange, placeholder = 'Search and select', error, disabled = false, required = false, }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [highlight, setHighlight] = useState(0);
    const containerRef = useRef(null);
    const listId = useId();
    const errorId = `${id}-error`;
    const selected = options.find((option) => option.value === value);
    const filtered = options.filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase()));
    useEffect(() => {
        setHighlight(0);
    }, [query, open]);
    useEffect(() => {
        function onDocumentMouseDown(event) {
            const target = event.target;
            if (target instanceof Node && !containerRef.current?.contains(target)) {
                setOpen(false);
                setQuery('');
            }
        }
        document.addEventListener('mousedown', onDocumentMouseDown);
        return () => document.removeEventListener('mousedown', onDocumentMouseDown);
    }, []);
    function selectOption(nextValue) {
        onChange(nextValue);
        setOpen(false);
        setQuery('');
    }
    function onKeyDown(event) {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
            setHighlight((current) => Math.min(current + 1, Math.max(filtered.length - 1, 0)));
            return;
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHighlight((current) => Math.max(current - 1, 0));
            return;
        }
        if (event.key === 'Enter' && open) {
            event.preventDefault();
            const option = filtered[highlight];
            if (option) {
                selectOption(option.value);
            }
            return;
        }
        if (event.key === 'Escape') {
            setOpen(false);
            setQuery('');
        }
    }
    return (<div className="field" ref={containerRef}>
      <label htmlFor={id}>
        {label}
        {required ? (<span className="req" aria-hidden="true">
            *
          </span>) : null}
      </label>
      <div className="combo">
        <input id={id} className={error ? 'control is-invalid' : 'control'} role="combobox" aria-expanded={open} aria-controls={listId} aria-autocomplete="list" aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined} disabled={disabled} placeholder={placeholder} value={open ? query : (selected?.label ?? '')} onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
        }} onFocus={() => {
            if (!disabled) {
                setQuery('');
                setOpen(true);
            }
        }} onKeyDown={onKeyDown}/>
        {open && !disabled ? (<ul className="combo-list" id={listId} role="listbox">
            {filtered.map((option, index) => (<li key={option.value} role="presentation">
                <button type="button" role="option" id={`${listId}-${option.value}`} className={index === highlight ? 'combo-option is-active' : 'combo-option'} aria-selected={option.value === value} onMouseDown={(event) => event.preventDefault()} onClick={() => selectOption(option.value)}>
                  {option.label}
                </button>
              </li>))}
            {filtered.length === 0 ? <li className="combo-empty">No matches</li> : null}
          </ul>) : null}
      </div>
      {error ? (<p className="field-error" id={errorId}>
          {error}
        </p>) : null}
    </div>);
}
