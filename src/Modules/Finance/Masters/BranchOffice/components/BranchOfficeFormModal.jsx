import { useMemo, useState } from 'react';
import { Button, Input, Modal, Select } from '../../../../../Common/components';
import { useToast } from '../../../../../Context/ToastContext';
import { FormSection } from '../../shared/FormSection';
import { TextAreaField } from '../../shared/TextAreaField';
import {
    countries,
    deploymentModels,
    headOfficeOptions,
    statesByCountry,
} from '../../shared/lookups';
import { validateBranchOffice } from './branchOfficeValidation';

const titles = {
    create: 'Add Branch Office',
    edit: 'Edit Branch Office',
    view: 'View Branch Office',
};

export function BranchOfficeFormModal({
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
    const stateOptions = useMemo(() => statesByCountry[form.country] || [], [form.country]);

    function updateField(key, value) {
        setForm((current) => {
            const next = { ...current, [key]: value };
            if (key === 'country') {
                next.state = '';
            }
            return next;
        });
        setErrors((current) => ({ ...current, [key]: undefined, ...(key === 'country' ? { state: undefined } : {}) }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (readOnly) {
            return;
        }
        const nextErrors = validateBranchOffice(form);
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
            wide
            onClose={onClose}
            footer={(
                <>
                    <Button variant="outline" onClick={onClose} disabled={saving}>
                        {readOnly ? 'Close' : 'Cancel'}
                    </Button>
                    {readOnly ? null : (
                        <Button variant="primary" type="submit" form="branch-office-form" loading={saving}>
                            Save
                        </Button>
                    )}
                </>
            )}
        >
            <form id="branch-office-form" className="master-form" onSubmit={handleSubmit} noValidate>
                {serverError ? <p className="form-error" role="alert">{serverError}</p> : null}
                <FormSection title="Office Information">
                    <Select
                        id="bo-head-office"
                        label="Head Office"
                        required
                        value={form.headOfficeId}
                        disabled={readOnly || saving}
                        error={errors.headOfficeId}
                        options={headOfficeOptions}
                        onChange={(value) => updateField('headOfficeId', value)}
                    />
                    <Input
                        id="bo-code"
                        label="Code / Username"
                        required
                        value={form.code}
                        disabled={readOnly || saving}
                        error={errors.code}
                        onChange={(value) => updateField('code', value)}
                    />
                    <Input
                        id="bo-name"
                        label="Name"
                        required
                        value={form.name}
                        disabled={readOnly || saving}
                        error={errors.name}
                        onChange={(value) => updateField('name', value)}
                    />
                    <Select
                        id="bo-deployment"
                        label="Deployment Model"
                        required
                        value={form.deploymentModel}
                        disabled={readOnly || saving}
                        error={errors.deploymentModel}
                        options={deploymentModels}
                        onChange={(value) => updateField('deploymentModel', value)}
                    />
                    <Input
                        id="bo-person"
                        label="Person Incharge"
                        value={form.personIncharge}
                        disabled={readOnly || saving}
                        onChange={(value) => updateField('personIncharge', value)}
                    />
                </FormSection>
                <FormSection title="Communication Details">
                    <Input
                        id="bo-mobile"
                        label="Mobile No"
                        required
                        value={form.mobileNo}
                        disabled={readOnly || saving}
                        error={errors.mobileNo}
                        onChange={(value) => updateField('mobileNo', value)}
                    />
                    <Input
                        id="bo-phone"
                        label="Phone No"
                        required
                        value={form.phoneNo}
                        disabled={readOnly || saving}
                        error={errors.phoneNo}
                        onChange={(value) => updateField('phoneNo', value)}
                    />
                    <Input
                        id="bo-email"
                        label="E-Mail"
                        required
                        type="email"
                        value={form.email}
                        disabled={readOnly || saving}
                        error={errors.email}
                        onChange={(value) => updateField('email', value)}
                    />
                    <div className="master-form-span-2">
                        <TextAreaField
                            id="bo-address"
                            label="Address"
                            value={form.address}
                            disabled={readOnly || saving}
                            onChange={(value) => updateField('address', value)}
                        />
                    </div>
                    <Input
                        id="bo-city"
                        label="City"
                        value={form.city}
                        disabled={readOnly || saving}
                        onChange={(value) => updateField('city', value)}
                    />
                    <Select
                        id="bo-country"
                        label="Country"
                        required
                        value={form.country}
                        disabled={readOnly || saving}
                        error={errors.country}
                        options={countries}
                        onChange={(value) => updateField('country', value)}
                    />
                    <Select
                        id="bo-state"
                        label="State / Province"
                        required
                        value={form.state}
                        disabled={readOnly || saving || !form.country}
                        error={errors.state}
                        options={stateOptions}
                        onChange={(value) => updateField('state', value)}
                    />
                    <Input
                        id="bo-postal"
                        label="Postal / Zip Code"
                        value={form.postalCode}
                        disabled={readOnly || saving}
                        onChange={(value) => updateField('postalCode', value)}
                    />
                    <Input
                        id="bo-third-party"
                        label="Third Party Code"
                        value={form.thirdPartyCode}
                        disabled={readOnly || saving}
                        onChange={(value) => updateField('thirdPartyCode', value)}
                    />
                </FormSection>
            </form>
        </Modal>
    );
}
