import { createMockRepository } from '../../shared/createMockRepository';
import { divisionOptions, societyOptions } from '../../shared/lookups';
import { projectCategoryOptions } from '../../ProjectCategory/mocks/projectCategories';
import { projectSeed } from '../mocks/projects';

function normalize(input, existing, currentId) {
    const code = String(input.code || '').trim();
    const societyId = String(input.societyId || '').trim();
    const projectCategoryId = String(input.projectCategoryId || '').trim();
    const projectName = String(input.projectName || '').trim();
    const divisionId = String(input.divisionId || '').trim();

    if (!societyOptions.some((item) => item.value === societyId)) {
        throw new Error('Select a valid society.');
    }
    if (!projectCategoryOptions.some((item) => item.value === projectCategoryId)) {
        throw new Error('Select a valid project category.');
    }
    if (!projectName) {
        throw new Error('Enter the project name.');
    }
    if (!divisionOptions.some((item) => item.value === divisionId)) {
        throw new Error('Select a valid division.');
    }
    if (code && existing.some((row) => row.id !== currentId && row.code && row.code.toLowerCase() === code.toLowerCase())) {
        throw new Error('This project code is already in use.');
    }
    if (
        existing.some(
            (row) =>
                row.id !== currentId &&
                row.societyId === societyId &&
                row.projectName.toLowerCase() === projectName.toLowerCase(),
        )
    ) {
        throw new Error('This project already exists for the selected society.');
    }

    return {
        code,
        societyId,
        projectCategoryId,
        projectName,
        description: String(input.description || '').trim(),
        divisionId,
    };
}

export const projectMockRepository = createMockRepository(projectSeed, normalize, {
    sortFn: (left, right) => left.projectName.localeCompare(right.projectName, undefined, { numeric: true }),
});
