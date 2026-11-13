const toneMap = {
    active: 'active',
    open: 'active',
    registered: 'active',
    available: 'active',
    inactive: 'inactive',
    closed: 'inactive',
    expired: 'inactive',
    applied: 'warning',
    'not registered': 'inactive',
    'not available': 'inactive',
};

export function StatusBadge({ status }) {
    const text = String(status || '—');
    const tone = toneMap[text.toLowerCase()] || 'inactive';
    return <span className={`status-badge status-${tone}`}>{text}</span>;
}
