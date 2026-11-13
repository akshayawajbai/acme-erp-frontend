import { createMockRepository } from '../../shared/createMockRepository';
import { parseLocalIsoDate } from '../../../../../utilities/dates';
import { ledgerGroupOptions, ledgerMasterSeed, projectCategoryOptions } from '../mocks/ledgers';

function normalize(input, existing, currentId) {
    const code = String(input.code || '').trim();
    const ledgerName = String(input.ledgerName || '').trim();
    const ledgerGroupId = String(input.ledgerGroupId || '').trim();
    const startedOn = String(input.startedOn || '').trim();
    const closedOn = String(input.closedOn || '').trim();
    const projectCategoryId = String(input.projectCategoryId || '').trim();

    if (!ledgerName) {
        throw new Error('Enter the ledger name.');
    }
    if (!ledgerGroupOptions.some((item) => item.value === ledgerGroupId)) {
        throw new Error('Select a valid ledger group.');
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
    if (!projectCategoryOptions.some((item) => item.value === projectCategoryId)) {
        throw new Error('Select a valid project category.');
    }
    if (code && existing.some((row) => row.id !== currentId && row.code && row.code.toLowerCase() === code.toLowerCase())) {
        throw new Error('This ledger code is already in use.');
    }
    if (
        existing.some(
            (row) =>
                row.id !== currentId &&
                row.ledgerGroupId === ledgerGroupId &&
                row.ledgerName.toLowerCase() === ledgerName.toLowerCase(),
        )
    ) {
        throw new Error('This ledger already exists in the selected ledger group.');
    }

    return {
        code,
        ledgerName,
        ledgerGroupId,
        startedOn,
        closedOn,
        projectCategoryId,
    };
}

export const ledgerMasterMockRepository = createMockRepository(ledgerMasterSeed, normalize, {
    sortFn: (left, right) => left.ledgerName.localeCompare(right.ledgerName, undefined, { numeric: true }),
});
