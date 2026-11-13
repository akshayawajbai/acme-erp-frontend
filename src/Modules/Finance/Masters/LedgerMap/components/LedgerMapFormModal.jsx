import { useState } from 'react';
import { Button, Modal, SearchableSelect, Select } from '../../../../../Common/components';
import { useToast } from '../../../../../Context/ToastContext';
import { FormSection } from '../../shared/FormSection';
import { SwitchField } from '../../shared/SwitchField';
import { fdInvestmentTypes } from '../../shared/lookups';
import { ledgerMapFlags } from '../mocks/ledgerMaps';
import { validateLedgerMap } from './ledgerMapValidation';

const titles = {
    create: 'Add Master Ledger Mapping',
    edit: 'Edit Master Ledger Mapping',
    view: 'View Master Ledger Mapping',
};

export function LedgerMapFormModal({
    mode,
    initial,
    ledgerOptions = [],
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
        const nextErrors = validateLedgerMap(form);
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
                        <Button variant="primary" type="submit" form="ledger-map-form" loading={saving}>
                            Save
                        </Button>
                    )}
                </>
            )}
        >
            <form id="ledger-map-form" className="master-form" onSubmit={handleSubmit} noValidate>
                {serverError ? <p className="form-error" role="alert">{serverError}</p> : null}
                <FormSection title="Ledger">
                    <SearchableSelect
                        id="lm-ledger"
                        label="Ledger"
                        required
                        value={form.ledgerId}
                        disabled={readOnly || saving}
                        error={errors.ledgerId}
                        options={ledgerOptions}
                        placeholder="Search ledger"
                        onChange={(value) => updateField('ledgerId', value)}
                    />
                    <Select
                        id="lm-fd-type"
                        label="FD Investment Type"
                        required
                        value={form.fdInvestmentType}
                        disabled={readOnly || saving}
                        error={errors.fdInvestmentType}
                        options={fdInvestmentTypes}
                        onChange={(value) => updateField('fdInvestmentType', value)}
                    />
                </FormSection>
                <FormSection title="Ledger Behaviour">
                    {ledgerMapFlags.map((flag) => (
                        <SwitchField
                            key={flag.key}
                            id={`lm-${flag.key}`}
                            label={flag.label}
                            checked={form[flag.key]}
                            disabled={readOnly || saving}
                            onChange={(checked) => updateField(flag.key, checked)}
                        />
                    ))}
                </FormSection>
            </form>
        </Modal>
    );
}
