import { createMockRepository } from '../../shared/createMockRepository';
import { branchOfficeOptions } from '../../shared/lookups';
import { locationSeed } from '../mocks/locations';

function normalize(input, existing, currentId) {
    const branchOfficeId = String(input.branchOfficeId || '').trim();
    const locationName = String(input.locationName || '').trim();

    if (!branchOfficeOptions.some((item) => item.value === branchOfficeId)) {
        throw new Error('Select a valid branch office.');
    }
    if (!locationName) {
        throw new Error('Enter the location name.');
    }
    if (
        existing.some(
            (row) =>
                row.id !== currentId &&
                row.branchOfficeId === branchOfficeId &&
                row.locationName.toLowerCase() === locationName.toLowerCase(),
        )
    ) {
        throw new Error('This location already exists for the selected branch office.');
    }

    return { branchOfficeId, locationName };
}

export const locationMockRepository = createMockRepository(locationSeed, normalize, {
    sortFn: (left, right) => left.locationName.localeCompare(right.locationName, undefined, { numeric: true }),
});
