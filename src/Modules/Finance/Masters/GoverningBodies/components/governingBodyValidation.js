import {
    collectErrors,
    dateOrder,
    optionalAadhaar,
    optionalDate,
    optionalEmail,
    optionalPan,
    optionalPhone,
    requiredDate,
    requiredSelect,
    requiredText,
} from '../../shared/validation';
import { designationOptions } from '../../shared/lookups';
import { parseLocalIsoDate, startOfLocalDay } from '../../../../../utilities/dates';

export function validateGoverningBody(form, today = startOfLocalDay(new Date())) {
    const birth = parseLocalIsoDate(form.dateOfBirth || '');

    return collectErrors({
        memberName: requiredText(form.memberName, 'Enter the member name.'),
        designation:
            requiredSelect(form.designation, 'Select a designation.')
            || (designationOptions.some((item) => item.value === form.designation)
                ? ''
                : 'Select a valid designation.'),
        enrolmentDate: requiredDate(form.enrolmentDate, 'Select the enrolment date.'),
        resignationDate:
            optionalDate(form.resignationDate)
            || dateOrder(
                form.enrolmentDate,
                form.resignationDate,
                'Resignation date cannot be before the enrolment date.',
            ),
        panNumber: optionalPan(form.panNumber),
        aadhaarNumber: optionalAadhaar(form.aadhaarNumber),
        cellNumber: optionalPhone(form.cellNumber),
        email: optionalEmail(form.email),
        dateOfBirth:
            optionalDate(form.dateOfBirth)
            || (birth && birth > today ? 'Date of birth cannot be in the future.' : ''),
    });
}
