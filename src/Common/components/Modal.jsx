import { useEffect, useId, useRef } from 'react';

export function Modal({ title, isOpen, busy = false, onClose, children, footer, wide = false }) {
    const dialogRef = useRef(null);
    const onCloseRef = useRef(onClose);
    const busyRef = useRef(busy);
    const titleId = useId();
    onCloseRef.current = onClose;
    busyRef.current = busy;

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const previousFocus = document.activeElement;
        const focusable = dialogRef.current?.querySelector(
            'input:not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable instanceof HTMLElement) {
            focusable.focus();
        } else {
            dialogRef.current?.focus();
        }
        function onKeyDown(event) {
            if (event.key === 'Escape' && !busyRef.current) {
                onCloseRef.current();
            }
        }
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKeyDown);
            if (previousFocus instanceof HTMLElement) {
                previousFocus.focus();
            }
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="modal-backdrop"
            onMouseDown={() => {
                if (!busy) {
                    onClose();
                }
            }}
        >
            <div
                className={wide ? 'modal modal--wide' : 'modal'}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                ref={dialogRef}
                tabIndex={-1}
                onMouseDown={(event) => event.stopPropagation()}
            >
                <header className="modal-header">
                    <h2 id={titleId}>{title}</h2>
                </header>
                <div className="modal-body">{children}</div>
                {footer ? <footer className="modal-footer">{footer}</footer> : null}
            </div>
        </div>
    );
}
