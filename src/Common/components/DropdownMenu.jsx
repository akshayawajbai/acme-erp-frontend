import { useEffect, useId, useRef, useState } from 'react';
import { useDismiss } from '../../Hooks/useDismiss';

export function DropdownMenu({ label = 'Actions', items }) {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState(null);
    const containerRef = useRef(null);
    const buttonRef = useRef(null);
    const menuId = useId();
    useDismiss(open, () => setOpen(false), containerRef);

    useEffect(() => {
        if (!open) {
            return undefined;
        }
        const first = containerRef.current?.querySelector('[role="menuitem"]');
        first?.focus();
        function close() {
            setOpen(false);
        }
        window.addEventListener('scroll', close, true);
        window.addEventListener('resize', close);
        return () => {
            window.removeEventListener('scroll', close, true);
            window.removeEventListener('resize', close);
        };
    }, [open]);

    function toggle() {
        if (open) {
            setOpen(false);
            return;
        }
        const rect = buttonRef.current?.getBoundingClientRect();
        if (rect) {
            setPosition({ top: rect.bottom + 6, right: Math.max(window.innerWidth - rect.right, 8) });
        }
        setOpen(true);
    }

    return (
        <div className="menu-wrap" ref={containerRef}>
            <button
                type="button"
                className="btn btn-outline btn-small"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={menuId}
                ref={buttonRef}
                onClick={toggle}
            >
                {label}
            </button>
            {open ? (
                <div className="menu-panel" id={menuId} role="menu" style={position ? { position: 'fixed', top: position.top, right: position.right } : undefined}>
                    {items.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            className="menu-item"
                            role="menuitem"
                            onClick={() => {
                                setOpen(false);
                                item.onClick();
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
