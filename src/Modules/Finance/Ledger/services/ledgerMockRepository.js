import { ledgerGroups, ledgerSeed } from '../mocks/ledgers';
import { createId } from '../../../../utilities/errors';
import { delay } from '../../../../utilities/delay';
let records = ledgerSeed.map((row) => ({ ...row }));
function sortedCopy() {
    return records
        .map((row) => ({ ...row }))
        .sort((left, right) => left.code.localeCompare(right.code, undefined, { numeric: true }));
}
function normalize(input) {
    if (input.status !== 'Active' && input.status !== 'Inactive') {
        throw new Error('Select a valid status.');
    }
    const code = input.code.trim();
    const name = input.name.trim();
    const groupName = input.groupName.trim();
    if (!code || !name || !groupName) {
        throw new Error('Enter the ledger code, name, and group.');
    }
    if (!ledgerGroups.includes(groupName)) {
        throw new Error('Select a valid ledger group.');
    }
    return { code, name, groupName, status: input.status };
}
function assertUniqueCode(code, currentId) {
    const duplicate = records.some((row) => row.code.toLowerCase() === code.toLowerCase() && row.id !== currentId);
    if (duplicate) {
        throw new Error('This ledger code is already in use.');
    }
}
export const ledgerMockRepository = {
    async list() {
        await delay(300);
        return sortedCopy();
    },
    async getGroups() {
        await delay(150);
        return [...ledgerGroups];
    },
    async create(input) {
        await delay(350);
        const next = normalize(input);
        assertUniqueCode(next.code);
        const ledger = { id: createId(), ...next };
        records = [...records, ledger];
        return { ...ledger };
    },
    async update(id, input) {
        await delay(350);
        const index = records.findIndex((row) => row.id === id);
        if (index < 0) {
            throw new Error('Ledger was not found.');
        }
        const next = normalize(input);
        assertUniqueCode(next.code, id);
        const ledger = { id, ...next };
        records = records.map((row) => (row.id === id ? ledger : row));
        return { ...ledger };
    },
};
