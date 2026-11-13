import { ledgerGroupSeed } from '../../LedgerGroup/mocks/ledgerGroups';
import { projectCategoryOptions } from '../../ProjectCategory/mocks/projectCategories';

/**
 * Static options built from the LedgerGroup seed (not the LedgerGroup service)
 * so this module does not depend on LedgerGroup runtime state.
 */
export const ledgerGroupOptions = ledgerGroupSeed.map((item) => ({
    value: item.id,
    label: item.ledgerGroupName,
}));

export { projectCategoryOptions };

export const ledgerMasterSeed = [
    {
        id: 'led-1',
        code: 'LED-001',
        ledgerName: 'Donations Received',
        ledgerGroupId: 'lg-1',
        startedOn: '2023-04-01',
        closedOn: '',
        projectCategoryId: 'pc-1',
    },
    {
        id: 'led-2',
        code: 'LED-002',
        ledgerName: 'Staff Salaries',
        ledgerGroupId: 'lg-2',
        startedOn: '2023-04-01',
        closedOn: '',
        projectCategoryId: 'pc-2',
    },
    {
        id: 'led-3',
        code: 'LED-003',
        ledgerName: 'Furniture and Fixtures',
        ledgerGroupId: 'lg-3',
        startedOn: '2022-04-01',
        closedOn: '2024-03-31',
        projectCategoryId: 'pc-3',
    },
    {
        id: 'led-4',
        code: 'LED-004',
        ledgerName: 'General Reserve Fund',
        ledgerGroupId: 'lg-4',
        startedOn: '2024-04-01',
        closedOn: '',
        projectCategoryId: 'pc-1',
    },
];

export const ledgerOptions = ledgerMasterSeed.map((item) => ({
    value: item.id,
    label: item.ledgerName,
}));
