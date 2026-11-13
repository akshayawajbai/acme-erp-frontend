export const projectCategorySeed = [
    {
        id: 'pc-1',
        categoryName: 'School Education',
        incomeTaxGroup: 'itg-edu',
        generalateGroup: 'gg-province',
    },
    {
        id: 'pc-2',
        categoryName: 'Community Health Care',
        incomeTaxGroup: 'itg-health',
        generalateGroup: 'gg-region',
    },
    {
        id: 'pc-3',
        categoryName: 'Poverty Relief and Welfare',
        incomeTaxGroup: 'itg-relief',
        generalateGroup: 'gg-mission',
    },
];

/**
 * Static options built from the seed names. Used by the Project form/repository so it
 * does not depend on the ProjectCategory service (avoids circular imports).
 */
export function getProjectCategoryOptions() {
    return projectCategorySeed.map((item) => ({ value: item.id, label: item.categoryName }));
}

export const projectCategoryOptions = getProjectCategoryOptions();
