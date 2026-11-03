import { Button } from '../Common/components/Button';
import { Modal } from '../Common/components/Modal';

export function LogoutConfirm({ open, busy, error, onCancel, onConfirm }) {
    return (
        <Modal
            title="Log out?"
            isOpen={open}
            busy={busy}
            onClose={onCancel}
            footer={(
                <>
                    <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="button" variant="danger" loading={busy} onClick={() => void onConfirm()}>
                        Log out
                    </Button>
                </>
            )}
        >
            <p>Are you sure you want to log out of ACME? Unsaved work on this device may be lost.</p>
            {error ? <p className="field-error">{error}</p> : null}
        </Modal>
    );
}
