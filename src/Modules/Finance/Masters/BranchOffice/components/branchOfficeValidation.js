import {
    collectErrors,
    requiredEmail,
    requiredPhone,
    requiredSelect,
    requiredText,
} from '../../shared/validation';
import { statesByCountry } from '../../shared/lookups';

export function validateBranchOffice(form) {
    const states = statesByCountry[form.country] || [];
    return collectErrors({
        headOfficeId: requiredSelect(form.headOfficeId, 'Select a head office.'),
        code: requiredText(form.code, 'Enter a code / username.'),
        name: requiredText(form.name, 'Enter a name.'),
        deploymentModel: requiredSelect(form.deploymentModel, 'Select a deployment model.'),
        mobileNo: requiredPhone(form.mobileNo, 'Enter a mobile number.'),
        phoneNo: requiredPhone(form.phoneNo, 'Enter a phone number.'),
        email: requiredEmail(form.email),
        country: requiredSelect(form.country, 'Select a country.'),
        state: !form.country
            ? 'Select a country first.'
            : !states.some((item) => item.value === form.state)
                ? 'Select a state / province.'
                : '',
    });
}
