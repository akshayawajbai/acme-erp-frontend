import { apiConfig, requireEndpoint } from '../../../../Api_Config/apiConfig';
import { httpClient } from '../../../../Api_Config/httpClient';
import { contractError, isRecord, readArray, readString } from '../../../../utilities/guards';
function mapStatus(value) {
    if (value === 'Active' || value === 'Inactive') {
        return value;
    }
    return null;
}
function mapLedger(value) {
    if (!isRecord(value)) {
        throw contractError('Ledger');
    }
    const id = readString(value, 'id');
    const code = readString(value, 'code');
    const name = readString(value, 'name');
    const groupName = readString(value, 'groupName');
    const status = mapStatus(readString(value, 'status'));
    if (!id || !code || !name || !groupName || !status) {
        throw contractError('Ledger');
    }
    return { id, code, name, groupName, status };
}
function resourcePath(path, id) {
    return `${path.replace(/\/$/, '')}/${encodeURIComponent(id)}`;
}
export const ledgerApiRepository = {
    async list() {
        const path = requireEndpoint(apiConfig.endpoints.ledgers, 'Ledger');
        const payload = await httpClient.get(path);
        const rows = readArray(payload);
        if (!rows) {
            throw contractError('Ledger');
        }
        return rows.map(mapLedger);
    },
    async getGroups() {
        const path = requireEndpoint(apiConfig.endpoints.ledgerGroups, 'Ledger group');
        const payload = await httpClient.get(path);
        const rows = readArray(payload);
        if (!rows || !rows.every((row) => typeof row === 'string' && row.trim().length > 0)) {
            throw contractError('Ledger group');
        }
        return rows;
    },
    async create(input) {
        const path = requireEndpoint(apiConfig.endpoints.ledgers, 'Ledger');
        const payload = await httpClient.post(path, input);
        return mapLedger(payload);
    },
    async update(id, input) {
        const path = requireEndpoint(apiConfig.endpoints.ledgers, 'Ledger');
        const payload = await httpClient.put(resourcePath(path, id), input);
        return mapLedger(payload);
    },
};
