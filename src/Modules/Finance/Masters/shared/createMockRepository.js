import { createId } from '../../../../utilities/errors';
import { delay } from '../../../../utilities/delay';

/**
 * In-memory CRUD repository for Finance Masters mock mode.
 * normalize(input, existing, currentId) must return the persisted record fields (without id)
 * or throw Error with a user-facing message.
 */
export function createMockRepository(seedRows, normalize, options = {}) {
    const sortFn = options.sortFn
        ?? ((left, right) => String(left.id).localeCompare(String(right.id)));
    let records = seedRows.map((row) => ({ ...row }));

    function sortedCopy() {
        return records.map((row) => ({ ...row })).sort(sortFn);
    }

    return {
        async list() {
            await delay(options.listDelay ?? 220);
            return sortedCopy();
        },
        async create(input) {
            await delay(options.writeDelay ?? 280);
            const next = normalize(input, records, undefined);
            const row = { id: createId(), ...next };
            records = [...records, row];
            return { ...row };
        },
        async update(id, input) {
            await delay(options.writeDelay ?? 280);
            const index = records.findIndex((row) => row.id === id);
            if (index < 0) {
                throw new Error('Record was not found.');
            }
            const next = normalize(input, records, id);
            const row = { id, ...next };
            records = records.map((item) => (item.id === id ? row : item));
            return { ...row };
        },
        async remove(id) {
            await delay(options.writeDelay ?? 240);
            const index = records.findIndex((row) => row.id === id);
            if (index < 0) {
                throw new Error('Record was not found.');
            }
            records = records.filter((row) => row.id !== id);
        },
    };
}
