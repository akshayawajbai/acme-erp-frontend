import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from '../Common/components/Icons';
import { searchableNavigation } from '../constants/routes';
import { useDismiss } from '../Hooks/useDismiss';

export function GlobalSearch() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState(0);
    const containerRef = useRef(null);
    useDismiss(open, () => setOpen(false), containerRef);

    const results = useMemo(() => {
        const term = query.trim().toLowerCase();
        const items = searchableNavigation();
        if (!term) {
            return items;
        }
        return items.filter((item) => `${item.label} ${item.group}`.toLowerCase().includes(term));
    }, [query]);

    function choose(item) {
        if (!item) {
            return;
        }
        setQuery('');
        setOpen(false);
        navigate(item.path);
    }

    return (
        <div className="global-search" ref={containerRef}>
            <label className="sr-only" htmlFor="global-search">Search pages</label>
            <SearchIcon />
            <input
                id="global-search"
                type="search"
                placeholder="Search pages"
                value={query}
                role="combobox"
                aria-expanded={open}
                aria-controls="global-search-list"
                autoComplete="off"
                onChange={(event) => {
                    setQuery(event.target.value);
                    setOpen(true);
                    setHighlight(0);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={(event) => {
                    if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        setOpen(true);
                        setHighlight((current) => Math.min(current + 1, Math.max(results.length - 1, 0)));
                    }
                    if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        setHighlight((current) => Math.max(current - 1, 0));
                    }
                    if (event.key === 'Enter' && open) {
                        event.preventDefault();
                        choose(results[highlight]);
                    }
                    if (event.key === 'Escape') {
                        setOpen(false);
                    }
                }}
            />
            {query ? (
                <button type="button" className="search-clear" aria-label="Clear search" onClick={() => { setQuery(''); setOpen(false); }}>
                    Clear
                </button>
            ) : null}
            {open ? (
                <ul className="search-results" id="global-search-list" role="listbox">
                    {results.length === 0 ? <li className="combo-empty">No matching pages</li> : results.map((item, index) => (
                        <li key={item.path}>
                            <button
                                type="button"
                                role="option"
                                aria-selected={index === highlight}
                                className={index === highlight ? 'search-result is-active' : 'search-result'}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => choose(item)}
                            >
                                <strong>{item.label}</strong>
                                <span>{item.group}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}
