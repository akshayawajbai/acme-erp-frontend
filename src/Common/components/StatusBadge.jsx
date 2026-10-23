export function StatusBadge({ status }) {
    const tone = status.toLowerCase() === 'active' ? 'active' : 'inactive';
    return <span className={`status-badge status-${tone}`}>{status}</span>;
}
