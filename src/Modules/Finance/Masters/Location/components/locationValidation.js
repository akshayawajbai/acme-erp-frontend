import { collectErrors, requiredSelect, requiredText } from '../../shared/validation';

export function validateLocation(form) {
    return collectErrors({
        branchOfficeId: requiredSelect(form.branchOfficeId, 'Select a branch office.'),
        locationName: requiredText(form.locationName, 'Enter the location name.'),
    });
}
