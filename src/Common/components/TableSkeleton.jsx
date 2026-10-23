export function TableSkeleton({ columns = 5, rows = 6 }) {
    return (
        <div className="table-wrap" aria-hidden="true">
            <div className="skeleton-table">
                {Array.from({ length: rows }, (_, rowIndex) => (
                    <div className="skeleton-row" key={rowIndex}>
                        {Array.from({ length: columns }, (_, columnIndex) => (
                            <span className="skeleton" key={columnIndex} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
