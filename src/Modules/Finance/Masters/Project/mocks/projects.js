export const projectSeed = [
    {
        id: 'prj-1',
        code: 'PRJ-001',
        societyId: 'soc-hope',
        projectCategoryId: 'pc-1',
        projectName: 'Rural School Support Programme',
        description: 'Scholarships, classroom materials, and teacher training for village schools.',
        divisionId: 'div-south',
    },
    {
        id: 'prj-2',
        code: 'PRJ-002',
        societyId: 'soc-care',
        projectCategoryId: 'pc-2',
        projectName: 'Mobile Health Clinic',
        description: 'Weekly outreach clinics offering basic diagnostics and medicines.',
        divisionId: 'div-north',
    },
    {
        id: 'prj-3',
        code: 'PRJ-003',
        societyId: 'soc-green',
        projectCategoryId: 'pc-3',
        projectName: 'Community Food Relief Drive',
        description: 'Food kits and nutrition support for vulnerable families.',
        divisionId: 'div-central',
    },
];

export const projectOptions = projectSeed.map((item) => ({
    value: item.id,
    label: item.projectName,
}));
