import { createMockRepository } from '../../shared/createMockRepository';
import { ledgerNatureOptions } from '../../shared/lookups';
import { ledgerGroupSeed } from '../mocks/ledgerGroups';

function normalize(input, existing, currentId) {
    const ledgerNature = String(input.ledgerNature || '').trim();
    const ledgerGroupName = String(input.ledgerGroupName || '').trim();

    if (!ledgerNatureOptions.some((item) => item.value === ledgerNature)) {
        throw new Error('Select a valid ledger nature.');
    }
    if (!ledgerGroupName) {
        throw new Error('Enter the ledger group name.');
    }
    if (existing.some((row) => row.id !== currentId && row.ledgerGroupName.toLowerCase() === ledgerGroupName.toLowerCase())) {
        throw new Error('This ledger group name is already in use.');
    }

    return { ledgerNature, ledgerGroupName };
}

export const ledgerGroupMockRepository = createMockRepository(ledgerGroupSeed, normalize, {
    sortFn: (left, right) => left.ledgerGroupName.localeCompare(right.ledgerGroupName, undefined, { numeric: true }),
});
