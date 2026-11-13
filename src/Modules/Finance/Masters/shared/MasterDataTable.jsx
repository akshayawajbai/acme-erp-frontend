import { useEffect, useId, useMemo, useState } from 'react';
import { Button, DataTable, Select } from '../../../../Common/components';

const PAGE_SIZE_OPTIONS = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
];

function compareValues(left, right) {
    if (typeof left === 'number' && typeof right === 'number') {
        return left - right;
    }
    return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' });
}

export function MasterDataTable({
    columns,
    rows,
    getRowKey,
    caption,
    emptyMessage = 'No records match your search.',
    onRefresh,
    refreshing = false,
}) {
    const pageSizeId = useId();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [hiddenKeys, setHiddenKeys] = useState(() => new Set());
    const [sort, setSort] = useState(null);
    const rowsSignature = `${rows.length}:${rows[0]?.id ?? ''}:${rows[rows.length - 1]?.id ?? ''}`;

    const toggleableColumns = useMemo(
        () => columns.filter((column) => column.key !== 'actions' && column.hideable !== false),
        [columns],
    );

    const visibleColumns = useMemo(
        () => columns.filter((column) => column.key === 'actions' || !hiddenKeys.has(column.key)),
        [columns, hiddenKeys],
    );

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

    const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize) || 1);

    useEffect(() => {
        setPage(1);
    }, [rowsSignature, pageSize]);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const pageRows = useMemo(() => {
        const start = (page - 1) * pageSize;
        return sortedRows.slice(start, start + pageSize);
    }, [page, pageSize, sortedRows]);

    function toggleColumn(key) {
        setHiddenKeys((current) => {
            const next = new Set(current);
            if (next.has(key)) {
                next.delete(key);
            } else if (visibleColumns.length > 2) {
                next.add(key);
            }
            return next;
        });
    }

    const from = sortedRows.length === 0 ? 0 : (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, sortedRows.length);

    return (
        <div className="master-table">
            <div className="master-table__toolbar">
                <div className="master-table__meta" aria-live="polite">
                    {sortedRows.length === 0 ? 'No records' : `Showing ${from}–${to} of ${sortedRows.length}`}
                </div>
                <div className="master-table__controls">
                    <Select
                        id={pageSizeId}
                        label="Rows per page"
                        value={String(pageSize)}
                        hidePlaceholder
                        options={PAGE_SIZE_OPTIONS}
                        onChange={(value) => setPageSize(Number(value))}
                    />
                    <details className="master-columns">
                        <summary>Columns</summary>
                        <div className="master-columns__list">
                            {toggleableColumns.map((column) => {
                                const checked = !hiddenKeys.has(column.key);
                                const disableHide = checked && visibleColumns.length <= 2;
                                return (
                                    <label key={column.key} className="master-columns__item">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            disabled={disableHide}
                                            onChange={() => toggleColumn(column.key)}
                                        />
                                        <span>{column.header}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </details>
                    {onRefresh ? (
                        <Button type="button" variant="outline" loading={refreshing} onClick={onRefresh}>
                            Refresh
                        </Button>
                    ) : null}
                </div>
            </div>
            <DataTable
                columns={visibleColumns}
                rows={pageRows}
                getRowKey={getRowKey}
                caption={caption}
                emptyMessage={emptyMessage}
                sort={sort}
                onSortChange={(next) => {
                    setSort(next);
                    setPage(1);
                }}
                disableInternalSort
            />
            <div className="master-table__pager">
                <Button
                    type="button"
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                    Previous
                </Button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <Button
                    type="button"
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
