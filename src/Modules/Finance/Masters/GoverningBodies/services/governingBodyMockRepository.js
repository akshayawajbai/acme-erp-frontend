import { createMockRepository } from '../../shared/createMockRepository';
import { validateGoverningBody } from '../components/governingBodyValidation';
import { governingBodySeed } from '../mocks/governingBodies';

function text(value) {
    return String(value || '').trim();
}

function normalize(input, existing, currentId) {
    const errors = validateGoverningBody(input);
    const firstMessage = Object.values(errors)[0];
    if (firstMessage) {
        throw new Error(firstMessage);
    }

    const panNumber = text(input.panNumber).toUpperCase();
    const aadhaarNumber = text(input.aadhaarNumber).replace(/\s/g, '');

    if (panNumber && existing.some((row) => row.id !== currentId && row.panNumber === panNumber)) {
        throw new Error('Another member already uses this PAN.');
    }
    if (aadhaarNumber && existing.some((row) => row.id !== currentId && row.aadhaarNumber === aadhaarNumber)) {
        throw new Error('Another member already uses this Aadhaar number.');
    }

    return {
        memberName: text(input.memberName),
        fullAddress: text(input.fullAddress),
        designation: text(input.designation),
        enrolmentDate: text(input.enrolmentDate),
        resignationDate: text(input.resignationDate),
        panNumber,
        aadhaarNumber,
        cellNumber: text(input.cellNumber),
        email: text(input.email).toLowerCase(),
        dateOfBirth: text(input.dateOfBirth),
    };
}

export const governingBodyMockRepository = createMockRepository(governingBodySeed, normalize, {
    sortFn: (left, right) => left.memberName.localeCompare(right.memberName, undefined, { numeric: true }),
});
