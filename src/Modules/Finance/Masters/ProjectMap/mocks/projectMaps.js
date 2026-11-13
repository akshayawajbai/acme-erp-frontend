import { projectOptions, projectSeed } from '../../Project/mocks/projects';

export { projectOptions };

function projectNameFor(id) {
    return projectSeed.find((item) => item.id === id)?.projectName || id;
}

export const projectMapSeed = [
    {
        id: 'pm-1',
        branchOfficeId: 'br-chn-tnagar',
        sectorId: 'sec-edu',
        projectId: 'prj-1',
        projectName: projectNameFor('prj-1'),
        userId: 'usr-anita',
        startedOn: '2024-04-01',
        closedOn: '',
    },
    {
        id: 'pm-2',
        branchOfficeId: 'br-mum-andheri',
        sectorId: 'sec-health',
        projectId: 'prj-2',
        projectName: projectNameFor('prj-2'),
        userId: 'usr-vikram',
        startedOn: '2023-06-15',
        closedOn: '2025-03-31',
    },
    {
        id: 'pm-3',
        branchOfficeId: 'br-del-cp',
        sectorId: 'sec-social',
        projectId: 'prj-3',
        projectName: projectNameFor('prj-3'),
        userId: 'usr-meera',
        startedOn: '2025-01-10',
        closedOn: '',
    },
];
