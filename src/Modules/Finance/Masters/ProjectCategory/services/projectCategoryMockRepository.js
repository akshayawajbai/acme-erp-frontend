import { createMockRepository } from '../../shared/createMockRepository';
import { generalateGroups, incomeTaxGroups } from '../../shared/lookups';
import { projectCategorySeed } from '../mocks/projectCategories';

function normalize(input, existing, currentId) {
    const categoryName = String(input.categoryName || '').trim();
    const incomeTaxGroup = String(input.incomeTaxGroup || '').trim();
    const generalateGroup = String(input.generalateGroup || '').trim();

    if (!categoryName) {
        throw new Error('Enter the category name.');
    }
    if (incomeTaxGroup && !incomeTaxGroups.some((item) => item.value === incomeTaxGroup)) {
        throw new Error('Select a valid income tax group.');
    }
    if (generalateGroup && !generalateGroups.some((item) => item.value === generalateGroup)) {
        throw new Error('Select a valid generalate group.');
    }
    if (existing.some((row) => row.id !== currentId && row.categoryName.toLowerCase() === categoryName.toLowerCase())) {
        throw new Error('This category name is already in use.');
    }

    return { categoryName, incomeTaxGroup, generalateGroup };
}

export const projectCategoryMockRepository = createMockRepository(projectCategorySeed, normalize, {
    sortFn: (left, right) => left.categoryName.localeCompare(right.categoryName, undefined, { numeric: true }),
});
