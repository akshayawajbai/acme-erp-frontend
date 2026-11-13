import {
    collectErrors,
    dateOrder,
    optionalDate,
    optionalPan,
    requiredSelect,
    requiredText,
} from '../../shared/validation';
import {
    fcraNatureOptions,
    panStatusOptions,
    registrationStatusOptions,
    societyObjectOptions,
    statesByCountry,
    status12AOptions,
    userOptions,
} from '../../shared/lookups';
import { parseLocalIsoDate } from '../../../../../utilities/dates';
import { societyTrustTypeOptions } from './societyConstants';

function inOptions(options, value) {
    return options.some((item) => item.value === value);
}

function needIf(condition, value, message) {
    return condition ? requiredText(value, message) : '';
}

export function validateSociety(form) {
    const isSociety = form.societyTrustType === 'Society';
    const isTrust = form.societyTrustType === 'Trust';
    const states = statesByCountry[form.country] || [];
    const fcraRegistered = form.fcraStatus === 'Registered';
    const objects = Array.isArray(form.objectOfSociety) ? form.objectOfSociety : [];

    return collectErrors({
        // A. Society information
        societyName: requiredText(form.societyName, 'Enter the society / trust name.'),
        societyTrustType:
            requiredSelect(form.societyTrustType, 'Select Society or Trust.')
            || (inOptions(societyTrustTypeOptions, form.societyTrustType) ? '' : 'Select Society or Trust.'),
        societyRegistrationNumber: needIf(isSociety, form.societyRegistrationNumber, 'Enter the society registration number.'),
        trustDocumentNumber: needIf(isTrust, form.trustDocumentNumber, 'Enter the trust document number.'),
        registrationDate: optionalDate(form.registrationDate),
        branchUsersIncharge:
            form.branchUsersIncharge && !inOptions(userOptions, form.branchUsersIncharge)
                ? 'Select a valid user.'
                : '',

        // B. PAN
        panStatus: form.panStatus && !inOptions(panStatusOptions, form.panStatus) ? 'Select a valid PAN status.' : '',
        panNumber:
            needIf(form.panStatus === 'Available', form.panNumber, 'Enter the PAN number.')
            || optionalPan(form.panNumber),
        panRegistrationDate: optionalDate(form.panRegistrationDate),

        // C. DARPAN
        darpanStatus:
            form.darpanStatus && !inOptions(registrationStatusOptions, form.darpanStatus)
                ? 'Select a valid DARPAN status.'
                : '',
        darpanId: needIf(form.darpanStatus === 'Registered', form.darpanId, 'Enter the DARPAN ID.'),
        darpanRegistrationDate: optionalDate(form.darpanRegistrationDate),

        // D. TAN
        tanRegisterDate: optionalDate(form.tanRegisterDate),

        // E. 12A
        status12A:
            form.status12A && !inOptions(status12AOptions, form.status12A) ? 'Select a valid 12A status.' : '',
        number12A: needIf(form.status12A === 'Active', form.number12A, 'Enter the 12A registration number.'),
        validity12A: optionalDate(form.validity12A),

        // F. 80G
        registrationDate80G: optionalDate(form.registrationDate80G),
        validity80G:
            optionalDate(form.validity80G)
            || dateOrder(
                form.registrationDate80G,
                form.validity80G,
                '80G validity cannot be before the 80G registration date.',
            ),

        // G. FCRA
        fcraStatus:
            form.fcraStatus && !inOptions(registrationStatusOptions, form.fcraStatus)
                ? 'Select a valid FCRA status.'
                : '',
        fcraNumber: needIf(fcraRegistered, form.fcraNumber, 'Enter the FCRA number.'),
        fcraRegistrationDate: fcraRegistered ? optionalDate(form.fcraRegistrationDate) : '',
        fcraValidity: fcraRegistered
            ? optionalDate(form.fcraValidity)
              || dateOrder(
                  form.fcraRegistrationDate,
                  form.fcraValidity,
                  'FCRA validity cannot be before the FCRA registration date.',
              )
            : '',
        fcraNature: fcraRegistered
            ? requiredSelect(form.fcraNature, 'Select the FCRA nature.')
              || (inOptions(fcraNatureOptions, form.fcraNature) ? '' : 'Select a valid FCRA nature.')
            : '',

        // H. Income tax
        objectOfSociety: objects.every((item) => inOptions(societyObjectOptions, item))
            ? ''
            : 'Select valid objects only.',

        // J. Address
        country: requiredSelect(form.country, 'Select a country.'),
        state: !form.country
            ? 'Select a country first.'
            : !states.some((item) => item.value === form.state)
                ? 'Select a state / province.'
                : '',
    });
}

/**
 * Local-only registration validity check (no external APIs).
 * Returns { status, detail } where status is a StatusBadge label.
 */
export function computeRegistrationValidity({ number, validity, appliedLabel, today }) {
    if (appliedLabel) {
        return { status: 'Applied', detail: appliedLabel };
    }
    if (!number && !validity) {
        return { status: 'Not Available', detail: 'No registration details have been entered.' };
    }
    const date = parseLocalIsoDate(validity || '');
    if (!date) {
        return { status: 'Not Available', detail: 'Validity date is missing, so validity cannot be checked.' };
    }
    const msPerDay = 24 * 60 * 60 * 1000;
    const days = Math.round((date.getTime() - today.getTime()) / msPerDay);
    if (days < 0) {
        const ago = Math.abs(days);
        return {
            status: 'Expired',
            warning: true,
            detail: `Validity ended ${ago} day${ago === 1 ? '' : 's'} ago. Renewal is required.`,
        };
    }
    if (days <= 90) {
        return {
            status: 'Active',
            warning: true,
            detail: days === 0 ? 'Validity ends today.' : `Validity ends in ${days} day${days === 1 ? '' : 's'}.`,
        };
    }
    return { status: 'Active', detail: `Valid for another ${days} days.` };
}
