import { useState } from 'react';
import { Button, Input, Modal, Select } from '../../../../../Common/components';
import { useToast } from '../../../../../Context/ToastContext';
import { FormSection } from '../../shared/FormSection';
import { generalateGroups, incomeTaxGroups } from '../../shared/lookups';
import { validateProjectCategory } from './projectCategoryValidation';

const titles = {
    create: 'Add Project Category',
    edit: 'Edit Project Category',
    view: 'View Project Category',
};

export function ProjectCategoryFormModal({
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
        const nextErrors = validateProjectCategory(form);
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
                        <Button variant="primary" type="submit" form="project-category-form" loading={saving}>
                            Save
                        </Button>
                    )}
                </>
            )}
        >
            <form id="project-category-form" className="master-form" onSubmit={handleSubmit} noValidate>
                {serverError ? <p className="form-error" role="alert">{serverError}</p> : null}
                <FormSection title="Category Information">
                    <Input
                        id="pc-name"
                        label="Category Name"
                        required
                        value={form.categoryName}
                        disabled={readOnly || saving}
                        error={errors.categoryName}
                        onChange={(value) => updateField('categoryName', value)}
                    />
                    <Select
                        id="pc-income-tax-group"
                        label="Income Tax Group"
                        value={form.incomeTaxGroup}
                        disabled={readOnly || saving}
                        error={errors.incomeTaxGroup}
                        options={incomeTaxGroups}
                        onChange={(value) => updateField('incomeTaxGroup', value)}
                    />
                    <Select
                        id="pc-generalate-group"
                        label="Generalate Group"
                        value={form.generalateGroup}
                        disabled={readOnly || saving}
                        error={errors.generalateGroup}
                        options={generalateGroups}
                        onChange={(value) => updateField('generalateGroup', value)}
                    />
                </FormSection>
            </form>
        </Modal>
    );
}
