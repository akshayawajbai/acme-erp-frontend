import { collectErrors, requiredSelect, requiredText } from '../../shared/validation';

export function validateProject(form) {
    return collectErrors({
        societyId: requiredSelect(form.societyId, 'Select a society.'),
        projectCategoryId: requiredSelect(form.projectCategoryId, 'Select a project category.'),
        projectName: requiredText(form.projectName, 'Enter the project name.'),
        divisionId: requiredSelect(form.divisionId, 'Select a division.'),
    });
}
