import { useState } from 'react';
import { Button, Input, Modal, Select } from '../../../../../Common/components';
import { useToast } from '../../../../../Context/ToastContext';
import { DateField } from '../../shared/DateField';
import { FormSection } from '../../shared/FormSection';
import { TextAreaField } from '../../shared/TextAreaField';
import { accountTypeOptions, operatedByOptions } from '../../shared/lookups';
import { validateBankAccount } from './bankAccountValidation';

const titles = {
    create: 'Add Bank Account',
    edit: 'Edit Bank Account',
    view: 'View Bank Account',
};

export function BankAccountFormModal({
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
        setErrors((current) => ({
            ...current,
            [key]: undefined,
            ...(key === 'openDate' ? { closedDate: undefined } : {}),
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (readOnly) {
            return;
        }
        const nextErrors = validateBankAccount(form);
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
                        <Button variant="primary" type="submit" form="bank-account-form" loading={saving}>
                            Save
                        </Button>
                    )}
                </>
            )}
        >
            <form id="bank-account-form" className="master-form" onSubmit={handleSubmit} noValidate>
                {serverError ? <p className="form-error" role="alert">{serverError}</p> : null}
                <FormSection title="Account Information">
                    <Input
                        id="ba-account-number"
                        label="Account Number"
                        required
                        value={form.accountNumber}
                        disabled={readOnly || saving}
                        error={errors.accountNumber}
                        onChange={(value) => updateField('accountNumber', value)}
                    />
                    <Input
                        id="ba-customer"
                        label="Customer Name"
                        required
                        value={form.customerName}
                        disabled={readOnly || saving}
                        error={errors.customerName}
                        onChange={(value) => updateField('customerName', value)}
                    />
                    <Input
                        id="ba-bank"
                        label="Bank Name"
                        required
                        value={form.bankName}
                        disabled={readOnly || saving}
                        error={errors.bankName}
                        onChange={(value) => updateField('bankName', value)}
                    />
                    <Input
                        id="ba-branch"
                        label="Branch"
                        required
                        value={form.branch}
                        disabled={readOnly || saving}
                        error={errors.branch}
                        onChange={(value) => updateField('branch', value)}
                    />
                    <Input
                        id="ba-ifsc"
                        label="IFSC"
                        required
                        value={form.ifsc}
                        disabled={readOnly || saving}
                        error={errors.ifsc}
                        onChange={(value) => updateField('ifsc', value.toUpperCase())}
                    />
                    <Select
                        id="ba-type"
                        label="Account Type"
                        required
                        value={form.accountType}
                        disabled={readOnly || saving}
                        error={errors.accountType}
                        options={accountTypeOptions}
                        onChange={(value) => updateField('accountType', value)}
                    />
                    <Select
                        id="ba-operated"
                        label="Operated By"
                        required
                        value={form.operatedBy}
                        disabled={readOnly || saving}
                        error={errors.operatedBy}
                        options={operatedByOptions}
                        onChange={(value) => updateField('operatedBy', value)}
                    />
                </FormSection>
                <FormSection title="Account Dates">
                    <DateField
                        id="ba-open"
                        label="Open Date"
                        required
                        value={form.openDate}
                        disabled={readOnly || saving}
                        error={errors.openDate}
                        onChange={(value) => updateField('openDate', value)}
                    />
                    <DateField
                        id="ba-closed"
                        label="Closed Date"
                        value={form.closedDate}
                        min={form.openDate || undefined}
                        disabled={readOnly || saving}
                        error={errors.closedDate}
                        onChange={(value) => updateField('closedDate', value)}
                    />
                </FormSection>
                <FormSection title="Branch Contact">
                    <div className="master-form-span-2">
                        <TextAreaField
                            id="ba-address"
                            label="Branch Address"
                            value={form.branchAddress}
                            disabled={readOnly || saving}
                            onChange={(value) => updateField('branchAddress', value)}
                        />
                    </div>
                    <Input
                        id="ba-email"
                        label="E-Mail"
                        required
                        type="email"
                        value={form.email}
                        disabled={readOnly || saving}
                        error={errors.email}
                        onChange={(value) => updateField('email', value)}
                    />
                    <Input
                        id="ba-phone"
                        label="Phone"
                        required
                        value={form.phone}
                        disabled={readOnly || saving}
                        error={errors.phone}
                        onChange={(value) => updateField('phone', value)}
                    />
                </FormSection>
            </form>
        </Modal>
    );
}
