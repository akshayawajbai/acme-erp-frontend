import { createMockRepository } from '../../shared/createMockRepository';
import { societyObjectOptions } from '../../shared/lookups';
import { validateSociety } from '../components/societyValidation';
import { societySeed } from '../mocks/societies';

function text(value) {
    return String(value || '').trim();
}

function upper(value) {
    return text(value).toUpperCase();
}

function normalize(input, existing, currentId) {
    const errors = validateSociety(input);
    const firstMessage = Object.values(errors)[0];
    if (firstMessage) {
        throw new Error(firstMessage);
    }

    const societyName = text(input.societyName);
    const societyRegistrationNumber = text(input.societyRegistrationNumber);
    const trustDocumentNumber = text(input.trustDocumentNumber);
    const registrationNumber = societyRegistrationNumber || trustDocumentNumber;

    if (existing.some((row) => row.id !== currentId && row.societyName.toLowerCase() === societyName.toLowerCase())) {
        throw new Error('A society / trust with this name already exists.');
    }
    if (
        registrationNumber
        && existing.some((row) => row.id !== currentId && row.registrationNumber.toLowerCase() === registrationNumber.toLowerCase())
    ) {
        throw new Error('This registration number is already in use.');
    }

    const fcraRegistered = input.fcraStatus === 'Registered';
    const selectedObjects = Array.isArray(input.objectOfSociety) ? input.objectOfSociety : [];

    return {
        societyName,
        societyTrustType: text(input.societyTrustType),
        societyRegistrationNumber,
        trustDocumentNumber,
        registrationDate: text(input.registrationDate),
        branchUsersIncharge: text(input.branchUsersIncharge),

        panStatus: text(input.panStatus),
        panNumber: upper(input.panNumber),
        panName: text(input.panName),
        panRegistrationDate: text(input.panRegistrationDate),

        darpanStatus: text(input.darpanStatus),
        darpanId: text(input.darpanId),
        darpanRegistrationDate: text(input.darpanRegistrationDate),
        darpanName: text(input.darpanName),

        tanRegisterNumber: upper(input.tanRegisterNumber),
        tanRegisterDate: text(input.tanRegisterDate),
        tanName: text(input.tanName),

        status12A: text(input.status12A),
        number12A: text(input.number12A),
        validity12A: text(input.validity12A),
        name12A: text(input.name12A),

        number80G: text(input.number80G),
        registrationDate80G: text(input.registrationDate80G),
        validity80G: text(input.validity80G),
        name80G: text(input.name80G),

        fcraStatus: text(input.fcraStatus),
        fcraNumber: fcraRegistered ? text(input.fcraNumber) : '',
        fcraRegistrationDate: fcraRegistered ? text(input.fcraRegistrationDate) : '',
        fcraValidity: fcraRegistered ? text(input.fcraValidity) : '',
        fcraNature: fcraRegistered ? text(input.fcraNature) : '',

        incomeTaxNature: text(input.incomeTaxNature),
        // Keep catalogue order so saved arrays are stable.
        objectOfSociety: societyObjectOptions
            .map((item) => item.value)
            .filter((value) => selectedObjects.includes(value)),

        address: text(input.address),
        city: text(input.city),
        country: text(input.country),
        state: text(input.state),
        postalCode: text(input.postalCode),

        // List-view aliases.
        name: societyName,
        registrationNumber,
    };
}

export const societyMockRepository = createMockRepository(societySeed, normalize, {
    sortFn: (left, right) => left.name.localeCompare(right.name, undefined, { numeric: true }),
});
