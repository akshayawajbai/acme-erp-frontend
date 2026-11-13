import { createMockRepository } from '../../shared/createMockRepository';
import { countries, deploymentModels, headOfficeOptions, statesByCountry } from '../../shared/lookups';
import { branchOfficeSeed } from '../mocks/branchOffices';

function normalize(input, existing, currentId) {
    const headOfficeId = String(input.headOfficeId || '').trim();
    const code = String(input.code || '').trim();
    const name = String(input.name || '').trim();
    const deploymentModel = String(input.deploymentModel || '').trim();
    const mobileNo = String(input.mobileNo || '').trim();
    const phoneNo = String(input.phoneNo || '').trim();
    const email = String(input.email || '').trim().toLowerCase();
    const country = String(input.country || '').trim();
    const state = String(input.state || '').trim();

    if (!headOfficeOptions.some((item) => item.value === headOfficeId)) {
        throw new Error('Select a valid head office.');
    }
    if (!code || !name) {
        throw new Error('Enter the code and name.');
    }
    if (!deploymentModels.some((item) => item.value === deploymentModel)) {
        throw new Error('Select a deployment model.');
    }
    if (!mobileNo || !phoneNo || !email) {
        throw new Error('Enter mobile, phone, and email.');
    }
    if (!countries.some((item) => item.value === country)) {
        throw new Error('Select a country.');
    }
    const states = statesByCountry[country] || [];
    if (!states.some((item) => item.value === state)) {
        throw new Error('Select a valid state for the country.');
    }
    if (existing.some((row) => row.code.toLowerCase() === code.toLowerCase() && row.id !== currentId)) {
        throw new Error('This branch code is already in use.');
    }

    return {
        headOfficeId,
        code,
        name,
        deploymentModel,
        personIncharge: String(input.personIncharge || '').trim(),
        mobileNo,
        phoneNo,
        email,
        address: String(input.address || '').trim(),
        city: String(input.city || '').trim(),
        country,
        state,
        postalCode: String(input.postalCode || '').trim(),
        thirdPartyCode: String(input.thirdPartyCode || '').trim(),
    };
}

export const branchOfficeMockRepository = createMockRepository(branchOfficeSeed, normalize, {
    sortFn: (left, right) => left.code.localeCompare(right.code, undefined, { numeric: true }),
});
