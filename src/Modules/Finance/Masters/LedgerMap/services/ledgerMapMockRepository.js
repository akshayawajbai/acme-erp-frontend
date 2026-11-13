import { createMockRepository } from '../../shared/createMockRepository';
import { fdInvestmentTypes, labelFor } from '../../shared/lookups';
import { ledgerMapFlags, ledgerMapSeed, ledgerOptions } from '../mocks/ledgerMaps';

function normalize(input, existing = [], currentId) {
    const ledgerId = String(input.ledgerId || '').trim();
    const fdInvestmentType = String(input.fdInvestmentType || '').trim();

    if (!ledgerOptions.some((item) => item.value === ledgerId)) {
        throw new Error('Select a valid ledger.');
    }
    if (!fdInvestmentTypes.some((item) => item.value === fdInvestmentType)) {
        throw new Error('Select a valid FD investment type.');
    }
    if (existing.some((row) => row.id !== currentId && row.ledgerId === ledgerId)) {
        throw new Error('A mapping already exists for this ledger.');
    }

    const result = {
        ledgerId,
        ledgerName: labelFor(ledgerOptions, ledgerId),
        fdInvestmentType,
    };
    ledgerMapFlags.forEach((flag) => {
        result[flag.key] = Boolean(input[flag.key]);
    });
    return result;
}

export const ledgerMapMockRepository = createMockRepository(ledgerMapSeed, normalize, {
    sortFn: (left, right) => String(left.ledgerName).localeCompare(String(right.ledgerName), undefined, { numeric: true }),
});
