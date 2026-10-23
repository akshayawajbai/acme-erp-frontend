import { apiConfig, requireEndpoint } from '../../../Api_Config/apiConfig';
import { httpClient } from '../../../Api_Config/httpClient';
import { contractError, isRecord, readArray, readString } from '../../../utilities/guards';
function mapHeadOffice(value) {
    if (!isRecord(value)) {
        throw contractError('Head office');
    }
    const id = readString(value, 'id');
    const name = readString(value, 'name');
    const city = readString(value, 'city');
    if (!id || !name || !city) {
        throw contractError('Head office');
    }
    return { id, name, city };
}
function mapBranchOffice(value) {
    if (!isRecord(value)) {
        throw contractError('Branch office');
    }
    const id = readString(value, 'id');
    const headOfficeId = readString(value, 'headOfficeId');
    const name = readString(value, 'name');
    if (!id || !headOfficeId || !name) {
        throw contractError('Branch office');
    }
    return { id, headOfficeId, name };
}
export const officeApiRepository = {
    async getHeadOffices() {
        const path = requireEndpoint(apiConfig.endpoints.headOffices, 'Head office');
        const payload = await httpClient.get(path);
        const rows = readArray(payload);
        if (!rows) {
            throw contractError('Head office');
        }
        return rows.map(mapHeadOffice);
    },
    async getBranchOffices(headOfficeId) {
        const path = requireEndpoint(apiConfig.endpoints.branches, 'Branch office');
        // Query name is isolated here until the branch API contract is confirmed.
        const payload = await httpClient.get(path, { headOfficeId });
        const rows = readArray(payload);
        if (!rows) {
            throw contractError('Branch office');
        }
        return rows.map(mapBranchOffice);
    },
};
