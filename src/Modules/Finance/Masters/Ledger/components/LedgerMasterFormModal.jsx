import { useState } from 'react';
import { Button, Input, Modal, Select } from '../../../../../Common/components';
import { useToast } from '../../../../../Context/ToastContext';
import { DateField } from '../../shared/DateField';
import { FormSection } from '../../shared/FormSection';
import { ledgerGroupOptions, projectCategoryOptions } from '../mocks/ledgers';
import { validateLedgerMaster } from './ledgerMasterValidation';

const titles = {
    create: 'Add Ledger',
    edit: 'Edit Ledger',
    view: 'View Ledger',
};

export function LedgerMasterFormModal({
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
        const nextErrors = validateLedgerMaster(form);
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
                        <Button variant="primary" type="submit" form="ledger-master-form" loading={saving}>
                            Save
                        </Button>
                    )}
                </>
            )}
        >
            <form id="ledger-master-form" className="master-form" onSubmit={handleSubmit} noValidate>
                {serverError ? <p className="form-error" role="alert">{serverError}</p> : null}
                <FormSection title="Ledger Information">
                    <Input
                        id="ldg-code"
                        label="Code"
                        value={form.code}
                        disabled={readOnly || saving}
                        onChange={(value) => updateField('code', value)}
                    />
                    <Input
                        id="ldg-name"
                        label="Ledger Name"
                        required
                        value={form.ledgerName}
                        disabled={readOnly || saving}
                        error={errors.ledgerName}
                        onChange={(value) => updateField('ledgerName', value)}
                    />
                    <Select
                        id="ldg-group"
                        label="Ledger Group"
                        required
                        value={form.ledgerGroupId}
                        disabled={readOnly || saving}
                        error={errors.ledgerGroupId}
                        options={ledgerGroupOptions}
                        onChange={(value) => updateField('ledgerGroupId', value)}
                    />
                    <Select
                        id="ldg-category"
                        label="Project Category"
                        required
                        value={form.projectCategoryId}
                        disabled={readOnly || saving}
                        error={errors.projectCategoryId}
                        options={projectCategoryOptions}
                        onChange={(value) => updateField('projectCategoryId', value)}
                    />
                </FormSection>
                <FormSection title="Validity">
                    <DateField
                        id="ldg-started"
                        label="Started On"
                        required
                        value={form.startedOn}
                        disabled={readOnly || saving}
                        error={errors.startedOn}
                        onChange={(value) => updateField('startedOn', value)}
                    />
                    <DateField
                        id="ldg-closed"
                        label="Closed On"
                        value={form.closedOn}
                        min={form.startedOn || undefined}
                        disabled={readOnly || saving}
                        error={errors.closedOn}
                        onChange={(value) => updateField('closedOn', value)}
                    />
                </FormSection>
            </form>
        </Modal>
    );
}
