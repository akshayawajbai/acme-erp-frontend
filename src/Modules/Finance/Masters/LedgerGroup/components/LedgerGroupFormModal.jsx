import { useState } from 'react';
import { Button, Input, Modal, Select } from '../../../../../Common/components';
import { useToast } from '../../../../../Context/ToastContext';
import { FormSection } from '../../shared/FormSection';
import { ledgerNatureOptions } from '../../shared/lookups';
import { validateLedgerGroup } from './ledgerGroupValidation';

const titles = {
    create: 'Add Ledger Group',
    edit: 'Edit Ledger Group',
    view: 'View Ledger Group',
};

export function LedgerGroupFormModal({
    mode,
    initial,
    serverError,
    saving,
    onClose,
    onSubmit,
}) {
    const [form, setForm] = useState(initial);
    const [errors, setErrors] = useState({});
    const { pushToast } = useToast();
    const readOnly = mode === 'view';

    function updateField(key, value) {
        setForm((current) => ({ ...current, [key]: value }));
        setErrors((current) => ({ ...current, [key]: undefined }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (readOnly) {
            return;
        }
        const nextErrors = validateLedgerGroup(form);
        setErrors(nextErrors);
        const messages = Object.values(nextErrors);
        if (messages.length > 0) {
            pushToast({ message: messages[0], tone: 'error' });
            return;
        }
        onSubmit({ ...form });
    }

    return (
        <Modal
            title={titles[mode]}
            isOpen
            busy={saving}
            onClose={onClose}
            footer={(
                <>
                    <Button variant="outline" onClick={onClose} disabled={saving}>
                        {readOnly ? 'Close' : 'Cancel'}
                    </Button>
                    {readOnly ? null : (
                        <Button variant="primary" type="submit" form="ledger-group-form" loading={saving}>
                            Save
                        </Button>
                    )}
                </>
            )}
        >
            <form id="ledger-group-form" className="master-form" onSubmit={handleSubmit} noValidate>
                {serverError ? <p className="form-error" role="alert">{serverError}</p> : null}
                <FormSection title="Ledger Group Information">
                    <Select
                        id="lg-nature"
                        label="Ledger Nature"
                        required
                        value={form.ledgerNature}
                        disabled={readOnly || saving}
                        error={errors.ledgerNature}
                        options={ledgerNatureOptions}
                        onChange={(value) => updateField('ledgerNature', value)}
                    />
                    <Input
                        id="lg-name"
                        label="Ledger Group Name"
                        required
                        value={form.ledgerGroupName}
                        disabled={readOnly || saving}
                        error={errors.ledgerGroupName}
                        onChange={(value) => updateField('ledgerGroupName', value)}
                    />
                </FormSection>
            </form>
        </Modal>
    );
}
