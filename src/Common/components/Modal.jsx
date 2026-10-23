import { useEffect, useRef } from 'react';
export function Modal({ title, isOpen, busy = false, onClose, children, footer }) {
    const dialogRef = useRef(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;
    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const previousFocus = document.activeElement;
        const focusable = dialogRef.current?.querySelector('input, select, textarea, button');
        focusable?.focus();
        function onKeyDown(event) {
            if (event.key === 'Escape' && !busy) {
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
    }, [isOpen, busy]);
    if (!isOpen) {
        return null;
    }
    return (<div className="modal-backdrop" onMouseDown={() => {
            if (!busy) {
                onClose();
            }
        }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={dialogRef} onMouseDown={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
        </header>
        <div className="modal-body">{children}</div>
        {footer ? <footer className="modal-footer">{footer}</footer> : null}
      </div>
    </div>);
}
