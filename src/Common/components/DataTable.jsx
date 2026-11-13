import { useMemo, useState } from 'react';

function cellClass(column) {
    return [column.align === 'end' ? 'is-numeric' : '', column.className || ''].filter(Boolean).join(' ') || undefined;
}

function compareValues(left, right) {
    if (typeof left === 'number' && typeof right === 'number') {
        return left - right;
    }
    return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' });
}

function nextSort(current, columnKey) {
    if (!current || current.key !== columnKey) {
        return { key: columnKey, direction: 'asc' };
    }
    if (current.direction === 'asc') {
        return { key: columnKey, direction: 'desc' };
    }
    return null;
}

export function DataTable({
    columns,
    rows,
    getRowKey,
    emptyMessage = 'No records to display.',
    caption,
    selectedKey,
    sort: controlledSort,
    onSortChange,
    disableInternalSort = false,
}) {
    const [uncontrolledSort, setUncontrolledSort] = useState(null);
    const isControlled = typeof onSortChange === 'function';
    const sort = isControlled ? controlledSort ?? null : uncontrolledSort;

    const sortedRows = useMemo(() => {
        if (disableInternalSort || !sort) {
            return rows;
        }
        const column = columns.find((item) => item.key === sort.key);
        if (!column?.sortValue) {
            return rows;
        }
        const next = [...rows].sort((left, right) => compareValues(column.sortValue(left), column.sortValue(right)));
        return sort.direction === 'desc' ? next.reverse() : next;
    }, [columns, disableInternalSort, rows, sort]);

    function toggleSort(column) {
        if (!column.sortValue) {
            return;
        }
        if (isControlled) {
            onSortChange(nextSort(sort, column.key));
            return;
        }
        setUncontrolledSort((current) => nextSort(current, column.key));
    }

    return (
        <div className="table-wrap">
            <table className="data-table">
                {caption ? <caption className="sr-only">{caption}</caption> : null}
                <thead>
                    <tr>
                        {columns.map((column) => {
                            const active = sort?.key === column.key ? sort.direction : null;
                            return (
                                <th
                                    key={column.key}
                                    scope="col"
                                    className={cellClass(column)}
                                    aria-sort={active === 'asc' ? 'ascending' : active === 'desc' ? 'descending' : 'none'}
                                >
                                    {column.sortValue ? (
                                        <button type="button" className="sort-button" onClick={() => toggleSort(column)}>
                                            {column.header}
                                            <span aria-hidden="true">{active === 'asc' ? '↑' : active === 'desc' ? '↓' : '↕'}</span>
                                        </button>
                                    ) : column.header}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {sortedRows.length === 0 ? (
                        <tr>
                            <td className="table-empty" colSpan={columns.length}>
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : sortedRows.map((row) => {
                        const key = getRowKey(row);
                        return (
                            <tr key={key} className={selectedKey === key ? 'is-selected' : undefined}>
                                {columns.map((column) => (
                                    <td key={column.key} className={cellClass(column)}>{column.render(row)}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
