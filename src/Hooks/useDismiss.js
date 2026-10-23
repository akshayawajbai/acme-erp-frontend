import { useEffect } from 'react';

export function useDismiss(open, onClose, containerRef) {
    useEffect(() => {
        if (!open) {
            return undefined;
        }
        function onMouseDown(event) {
            const target = event.target;
            if (target instanceof Node && !containerRef.current?.contains(target)) {
                onClose();
            }
        }
        function onKeyDown(event) {
            if (event.key === 'Escape') {
                onClose();
            }
        }
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open, onClose, containerRef]);
}
