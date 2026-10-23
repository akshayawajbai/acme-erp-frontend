import { useRef, useState } from 'react';
import { BellIcon } from '../Common/components/Icons';
import { useDismiss } from '../Hooks/useDismiss';

const initialNotices = [
    {
        id: 'notice-demo',
        title: 'Demonstration workspace',
        body: 'Dashboard figures and vouchers are sample data for this office.',
    },
    {
        id: 'notice-ledger',
        title: 'Ledger is available',
        body: 'You can search, add, view, and edit ledger records in this prototype.',
    },
    {
        id: 'notice-finance',
        title: 'Other finance pages',
        body: 'Receipts, payments, journals, and reports are marked as under development.',
    },
];

export function NotificationMenu() {
    const [open, setOpen] = useState(false);
    const [notices, setNotices] = useState(initialNotices.map((notice) => ({ ...notice, read: false })));
    const containerRef = useRef(null);
    const unread = notices.filter((notice) => !notice.read).length;
    useDismiss(open, () => setOpen(false), containerRef);

    return (
        <div className="menu-wrap" ref={containerRef}>
            <button type="button" className="icon-button" aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'} aria-expanded={open} onClick={() => setOpen((current) => !current)}>
                <BellIcon />
                {unread ? <span className="notice-count">{unread}</span> : null}
            </button>
            {open ? (
                <div className="menu-panel menu-panel-wide" role="menu">
                    <div className="menu-heading">
                        <strong>Notifications</strong>
                        <button type="button" className="text-button" onClick={() => setNotices((current) => current.map((notice) => ({ ...notice, read: true })))}>
                            Mark all read
                        </button>
                    </div>
                    <ul className="notice-list">
                        {notices.map((notice) => (
                            <li key={notice.id}>
                                <button
                                    type="button"
                                    className={notice.read ? 'notice is-read' : 'notice'}
                                    onClick={() => setNotices((current) => current.map((item) => item.id === notice.id ? { ...item, read: true } : item))}
                                >
                                    <strong>{notice.title}</strong>
                                    <span>{notice.body}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </div>
    );
}
