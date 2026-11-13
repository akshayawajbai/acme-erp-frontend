import { Button, Modal } from '../../../../Common/components';

export function ConfirmDeleteModal({
    open,
    title = 'Delete record?',
    message,
    busy = false,
    error = '',
    onCancel,
    onConfirm,
}) {
    return (
        <Modal
            title={title}
            isOpen={open}
            busy={busy}
            onClose={() => {
                if (!busy) {
                    onCancel();
                }
            }}
            footer={(
                <>
                    <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="button" variant="danger" loading={busy} onClick={onConfirm}>
                        Delete
                    </Button>
                </>
            )}
        >
            <p>{message}</p>
            {error ? <p className="field-error">{error}</p> : null}
        </Modal>
    );
}
