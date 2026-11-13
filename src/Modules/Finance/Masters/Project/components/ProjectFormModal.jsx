import { useState } from 'react';
import { Button, Input, Modal, Select } from '../../../../../Common/components';
import { useToast } from '../../../../../Context/ToastContext';
import { FormSection } from '../../shared/FormSection';
import { TextAreaField } from '../../shared/TextAreaField';
import { divisionOptions, societyOptions } from '../../shared/lookups';
import { projectCategoryOptions } from '../../ProjectCategory/mocks/projectCategories';
import { validateProject } from './projectValidation';

const titles = {
    create: 'Add Project',
    edit: 'Edit Project',
    view: 'View Project',
};

export function ProjectFormModal({
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
        const nextErrors = validateProject(form);
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
                        <Button variant="primary" type="submit" form="project-form" loading={saving}>
                            Save
                        </Button>
                    )}
                </>
            )}
        >
            <form id="project-form" className="master-form" onSubmit={handleSubmit} noValidate>
                {serverError ? <p className="form-error" role="alert">{serverError}</p> : null}
                <FormSection title="Project Information">
                    <Input
                        id="prj-code"
                        label="Code"
                        value={form.code}
                        disabled={readOnly || saving}
                        onChange={(value) => updateField('code', value)}
                    />
                    <Select
                        id="prj-society"
                        label="Society"
                        required
                        value={form.societyId}
                        disabled={readOnly || saving}
                        error={errors.societyId}
                        options={societyOptions}
                        onChange={(value) => updateField('societyId', value)}
                    />
                    <Select
                        id="prj-category"
                        label="Project Category"
                        required
                        value={form.projectCategoryId}
                        disabled={readOnly || saving}
                        error={errors.projectCategoryId}
                        options={projectCategoryOptions}
                        onChange={(value) => updateField('projectCategoryId', value)}
                    />
                    <Input
                        id="prj-name"
                        label="Project"
                        required
                        value={form.projectName}
                        disabled={readOnly || saving}
                        error={errors.projectName}
                        onChange={(value) => updateField('projectName', value)}
                    />
                    <Select
                        id="prj-division"
                        label="Division"
                        required
                        value={form.divisionId}
                        disabled={readOnly || saving}
                        error={errors.divisionId}
                        options={divisionOptions}
                        onChange={(value) => updateField('divisionId', value)}
                    />
                    <div className="master-form-span-2">
                        <TextAreaField
                            id="prj-description"
                            label="Description"
                            value={form.description}
                            disabled={readOnly || saving}
                            onChange={(value) => updateField('description', value)}
                        />
                    </div>
                </FormSection>
            </form>
        </Modal>
    );
}
