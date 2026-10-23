import { useMemo, useState } from 'react';

function compareValues(left, right) {
    if (typeof left === 'number' && typeof right === 'number') {
        return left - right;
    }
    return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' });
}

export function DataTable({ columns, rows, getRowKey, emptyMessage = 'No records to display.', caption, selectedKey, }) {
    const [sort, setSort] = useState(null);
    const sortedRows = useMemo(() => {
        if (!sort) {
            return rows;
        }
        const column = columns.find((item) => item.key === sort.key);
        if (!column?.sortValue) {
            return rows;
        }
        const next = [...rows].sort((left, right) => compareValues(column.sortValue(left), column.sortValue(right)));
        return sort.direction === 'desc' ? next.reverse() : next;
    }, [columns, rows, sort]);

    function toggleSort(column) {
        if (!column.sortValue) {
            return;
        }
        setSort((current) => {
            if (!current || current.key !== column.key) {
                return { key: column.key, direction: 'asc' };
            }
            if (current.direction === 'asc') {
                return { key: column.key, direction: 'desc' };
            }
            return null;
        });
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
                                <th key={column.key} scope="col" aria-sort={active === 'asc' ? 'ascending' : active === 'desc' ? 'descending' : 'none'}>
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
                                    <td key={column.key}>{column.render(row)}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
