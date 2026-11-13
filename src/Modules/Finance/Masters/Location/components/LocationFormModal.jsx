import { useState } from 'react';
import { Button, Input, Modal, Select } from '../../../../../Common/components';
import { useToast } from '../../../../../Context/ToastContext';
import { FormSection } from '../../shared/FormSection';
import { branchOfficeOptions } from '../../shared/lookups';
import { validateLocation } from './locationValidation';

const titles = {
    create: 'Add Location',
    edit: 'Edit Location',
    view: 'View Location',
};

export function LocationFormModal({
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
        const nextErrors = validateLocation(form);
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
                        <Button variant="primary" type="submit" form="location-form" loading={saving}>
                            Save
                        </Button>
                    )}
                </>
            )}
        >
            <form id="location-form" className="master-form" onSubmit={handleSubmit} noValidate>
                {serverError ? <p className="form-error" role="alert">{serverError}</p> : null}
                <FormSection title="Location Information">
                    <Select
                        id="loc-branch-office"
                        label="Branch Office"
                        required
                        value={form.branchOfficeId}
                        disabled={readOnly || saving}
                        error={errors.branchOfficeId}
                        options={branchOfficeOptions}
                        onChange={(value) => updateField('branchOfficeId', value)}
                    />
                    <Input
                        id="loc-name"
                        label="Location"
                        required
                        value={form.locationName}
                        disabled={readOnly || saving}
                        error={errors.locationName}
                        onChange={(value) => updateField('locationName', value)}
                    />
                </FormSection>
            </form>
        </Modal>
    );
}
