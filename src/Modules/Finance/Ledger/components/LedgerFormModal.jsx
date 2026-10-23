import { useState } from 'react';
import { Button, Input, Modal, Select } from '../../../../Common/components';
import { useToast } from '../../../../Context/ToastContext';
import { ledgerStatuses } from '../types/ledger';
import { validateLedger } from './ledgerValidation';
const titles = {
    create: 'Add Ledger',
    edit: 'Edit Ledger',
    view: 'View Ledger',
};
export function LedgerFormModal({ mode, initial, groups, existing, currentId, serverError, saving, onClose, onSubmit, }) {
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
        const nextErrors = validateLedger(form, existing, currentId);
        setErrors(nextErrors);
        const messages = Object.values(nextErrors);
        if (messages.length > 0) {
            pushToast({ message: messages[0], tone: 'error' });
            return;
        }
        onSubmit({
            code: form.code.trim(),
            name: form.name.trim(),
            groupName: form.groupName,
            status: form.status,
        });
    }
    return (<Modal title={titles[mode]} isOpen busy={saving} onClose={onClose} footer={<>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            {readOnly ? 'Close' : 'Cancel'}
          </Button>
          {readOnly ? null : (<Button variant="primary" type="submit" form="ledger-form" loading={saving}>
              Save
            </Button>)}
        </>}>
      <form id="ledger-form" className="stack" onSubmit={handleSubmit} noValidate>
        {serverError ? (<p className="form-error" role="alert">
            {serverError}
          </p>) : null}
        <Input id="ledger-code" label="Ledger Code" required value={form.code} disabled={readOnly || saving} error={errors.code} onChange={(value) => updateField('code', value)}/>
        <Input id="ledger-name" label="Ledger Name" required value={form.name} disabled={readOnly || saving} error={errors.name} onChange={(value) => updateField('name', value)}/>
        <Select id="ledger-group" label="Ledger Group" required value={form.groupName} disabled={readOnly || saving} error={errors.groupName} placeholder="Select ledger group" options={groups.map((group) => ({ value: group, label: group }))} onChange={(value) => updateField('groupName', value)}/>
        <Select id="ledger-status" label="Status" required value={form.status} disabled={readOnly || saving} error={errors.status} hidePlaceholder options={ledgerStatuses.map((status) => ({ value: status, label: status }))} onChange={(value) => updateField('status', value === 'Inactive' ? 'Inactive' : 'Active')}/>
      </form>
    </Modal>);
}
