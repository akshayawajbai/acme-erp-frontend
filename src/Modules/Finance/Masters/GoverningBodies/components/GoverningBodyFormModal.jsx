import { useState } from 'react';
import { Button, Input, Modal, Select } from '../../../../../Common/components';
import { useToast } from '../../../../../Context/ToastContext';
import { startOfLocalDay } from '../../../../../utilities/dates';
import { DateField } from '../../shared/DateField';
import { FormSection } from '../../shared/FormSection';
import { designationOptions } from '../../shared/lookups';
import { maskAadhaar, maskPan } from '../../shared/masks';
import { TextAreaField } from '../../shared/TextAreaField';
import { validateGoverningBody } from './governingBodyValidation';

const titles = {
    create: 'Add Governing Body Member',
    edit: 'Edit Governing Body Member',
    view: 'View Governing Body Member',
};

export function GoverningBodyFormModal({ mode, initial, serverError, saving, onClose, onSubmit }) {
    const [form, setForm] = useState(initial);
    const [errors, setErrors] = useState({});
    const [today] = useState(() => startOfLocalDay(new Date()));
    const { pushToast } = useToast();
    const readOnly = mode === 'view';
    const disabled = readOnly || saving;

    function updateField(key, value) {
        setForm((current) => ({ ...current, [key]: value }));
        setErrors((current) => ({ ...current, [key]: undefined }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (readOnly) {
            return;
        }
        const nextErrors = validateGoverningBody(form, today);
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
                        <Button variant="primary" type="submit" form="governing-body-form" loading={saving}>
                            Save
                        </Button>
                    )}
                </>
            )}
        >
            <form id="governing-body-form" className="master-form" onSubmit={handleSubmit} noValidate>
                {serverError ? <p className="form-error" role="alert">{serverError}</p> : null}
                <FormSection title="Member Details">
                    <Input
                        id="gb-name"
                        label="Member Name"
                        required
                        value={form.memberName}
                        disabled={disabled}
                        error={errors.memberName}
                        onChange={(value) => updateField('memberName', value)}
                    />
                    <Select
                        id="gb-designation"
                        label="Designation"
                        required
                        value={form.designation}
                        options={designationOptions}
                        disabled={disabled}
                        error={errors.designation}
                        onChange={(value) => updateField('designation', value)}
                    />
                    <DateField
                        id="gb-enrolment"
                        label="Enrolment Date"
                        required
                        value={form.enrolmentDate}
                        disabled={disabled}
                        error={errors.enrolmentDate}
                        onChange={(value) => updateField('enrolmentDate', value)}
                    />
                    <DateField
                        id="gb-resignation"
                        label="Resignation Date"
                        value={form.resignationDate}
                        min={form.enrolmentDate || undefined}
                        disabled={disabled}
                        error={errors.resignationDate}
                        onChange={(value) => updateField('resignationDate', value)}
                    />
                    <DateField
                        id="gb-dob"
                        label="Date of Birth"
                        value={form.dateOfBirth}
                        disabled={disabled}
                        error={errors.dateOfBirth}
                        onChange={(value) => updateField('dateOfBirth', value)}
                    />
                    <div className="master-form-span-2">
                        <TextAreaField
                            id="gb-address"
                            label="Full Address"
                            value={form.fullAddress}
                            disabled={disabled}
                            onChange={(value) => updateField('fullAddress', value)}
                        />
                    </div>
                </FormSection>
                <FormSection title="Identity and Contact">
                    <Input
                        id="gb-pan"
                        label="PAN Number"
                        placeholder="ABCDE1234F"
                        autoComplete="off"
                        value={readOnly ? maskPan(form.panNumber) : form.panNumber}
                        disabled={disabled}
                        error={errors.panNumber}
                        onChange={(value) => updateField('panNumber', value.toUpperCase().slice(0, 10))}
                    />
                    <Input
                        id="gb-aadhaar"
                        label="Aadhaar Number"
                        placeholder="12 digits"
                        autoComplete="off"
                        value={readOnly ? maskAadhaar(form.aadhaarNumber) : form.aadhaarNumber}
                        disabled={disabled}
                        error={errors.aadhaarNumber}
                        onChange={(value) => updateField('aadhaarNumber', value.replace(/\D/g, '').slice(0, 12))}
                    />
                    <Input
                        id="gb-cell"
                        label="Cell Number"
                        value={form.cellNumber}
                        disabled={disabled}
                        error={errors.cellNumber}
                        onChange={(value) => updateField('cellNumber', value)}
                    />
                    <Input
                        id="gb-email"
                        label="E-Mail"
                        type="email"
                        value={form.email}
                        disabled={disabled}
                        error={errors.email}
                        onChange={(value) => updateField('email', value)}
                    />
                </FormSection>
            </form>
        </Modal>
    );
}
