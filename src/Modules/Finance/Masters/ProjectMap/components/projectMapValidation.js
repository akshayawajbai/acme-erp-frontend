import {
    collectErrors,
    dateOrder,
    optionalDate,
    requiredDate,
    requiredSelect,
} from '../../shared/validation';

export function validateProjectMap(form) {
    return collectErrors({
        branchOfficeId: requiredSelect(form.branchOfficeId, 'Select a branch office.'),
        sectorId: requiredSelect(form.sectorId, 'Select a sector.'),
        projectId: requiredSelect(form.projectId, 'Select a project.'),
        userId: requiredSelect(form.userId, 'Select a user.'),
        startedOn: requiredDate(form.startedOn, 'Select the started on date.'),
        closedOn: optionalDate(form.closedOn)
            || dateOrder(form.startedOn, form.closedOn, 'Closed on date cannot be before started on date.'),
    });
}
