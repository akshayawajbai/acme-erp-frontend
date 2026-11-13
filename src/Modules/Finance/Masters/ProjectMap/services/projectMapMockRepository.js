import { createMockRepository } from '../../shared/createMockRepository';
import { branchOfficeOptions, labelFor, sectorOptions, userOptions } from '../../shared/lookups';
import { parseLocalIsoDate } from '../../../../../utilities/dates';
import { projectMapSeed, projectOptions } from '../mocks/projectMaps';

function normalize(input, existing = [], currentId) {
    const branchOfficeId = String(input.branchOfficeId || '').trim();
    const sectorId = String(input.sectorId || '').trim();
    const projectId = String(input.projectId || '').trim();
    const userId = String(input.userId || '').trim();
    const startedOn = String(input.startedOn || '').trim();
    const closedOn = String(input.closedOn || '').trim();

    if (!branchOfficeOptions.some((item) => item.value === branchOfficeId)) {
        throw new Error('Select a valid branch office.');
    }
    if (!sectorOptions.some((item) => item.value === sectorId)) {
        throw new Error('Select a valid sector.');
    }
    if (!projectOptions.some((item) => item.value === projectId)) {
        throw new Error('Select a valid project.');
    }
    if (!userOptions.some((item) => item.value === userId)) {
        throw new Error('Select a valid user.');
    }
    const start = parseLocalIsoDate(startedOn);
    if (!start) {
        throw new Error('Select the started on date.');
    }
    if (closedOn) {
        const end = parseLocalIsoDate(closedOn);
        if (!end) {
            throw new Error('Enter a valid closed on date.');
        }
        if (end < start) {
            throw new Error('Closed on date cannot be before started on date.');
        }
    }
    if (existing.some((row) => (
        row.id !== currentId
        && row.branchOfficeId === branchOfficeId
        && row.projectId === projectId
        && row.userId === userId
        && row.sectorId === sectorId
    ))) {
        throw new Error('This project mapping already exists for the selected branch, sector, and user.');
    }

    return {
        branchOfficeId,
        sectorId,
        projectId,
        projectName: labelFor(projectOptions, projectId),
        userId,
        startedOn,
        closedOn,
    };
}

export const projectMapMockRepository = createMockRepository(projectMapSeed, normalize, {
    sortFn: (left, right) => String(left.projectName).localeCompare(String(right.projectName), undefined, { numeric: true }),
});
