import { useState } from 'react';
import { Button, Modal, Select } from '../../../../../Common/components';
import { useToast } from '../../../../../Context/ToastContext';
import { DateField } from '../../shared/DateField';
import { FormSection } from '../../shared/FormSection';
import { branchOfficeOptions, sectorOptions, userOptions } from '../../shared/lookups';
import { projectOptions } from '../mocks/projectMaps';
import { validateProjectMap } from './projectMapValidation';

const titles = {
    create: 'Add Project Mapping',
    edit: 'Edit Project Mapping',
    view: 'View Project Mapping',
};

export function ProjectMapFormModal({
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
            ...(key === 'startedOn' ? { closedOn: undefined } : {}),
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (readOnly) {
            return;
        }
        const nextErrors = validateProjectMap(form);
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
                        <Button variant="primary" type="submit" form="project-map-form" loading={saving}>
                            Save
                        </Button>
                    )}
                </>
            )}
        >
            <form id="project-map-form" className="master-form" onSubmit={handleSubmit} noValidate>
                {serverError ? <p className="form-error" role="alert">{serverError}</p> : null}
                <FormSection title="Mapping Details">
                    <Select
                        id="pm-branch"
                        label="Branch Office"
                        required
                        value={form.branchOfficeId}
                        disabled={readOnly || saving}
                        error={errors.branchOfficeId}
                        options={branchOfficeOptions}
                        onChange={(value) => updateField('branchOfficeId', value)}
                    />
                    <Select
                        id="pm-sector"
                        label="Sector"
                        required
                        value={form.sectorId}
                        disabled={readOnly || saving}
                        error={errors.sectorId}
                        options={sectorOptions}
                        onChange={(value) => updateField('sectorId', value)}
                    />
                    <Select
                        id="pm-project"
                        label="Project"
                        required
                        value={form.projectId}
                        disabled={readOnly || saving}
                        error={errors.projectId}
                        options={projectOptions}
                        onChange={(value) => updateField('projectId', value)}
                    />
                    <Select
                        id="pm-user"
                        label="User"
                        required
                        value={form.userId}
                        disabled={readOnly || saving}
                        error={errors.userId}
                        options={userOptions}
                        onChange={(value) => updateField('userId', value)}
                    />
                </FormSection>
                <FormSection title="Validity">
                    <DateField
                        id="pm-started"
                        label="Started On"
                        required
                        value={form.startedOn}
                        disabled={readOnly || saving}
                        error={errors.startedOn}
                        onChange={(value) => updateField('startedOn', value)}
                    />
                    <DateField
                        id="pm-closed"
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
