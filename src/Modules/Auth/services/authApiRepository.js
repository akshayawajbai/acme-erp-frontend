import { apiConfig, requireEndpoint } from '../../../Api_Config/apiConfig';
import { httpClient } from '../../../Api_Config/httpClient';
import { contractError, isRecord, readString } from '../../../utilities/guards';
function mapSession(value) {
    if (!isRecord(value)) {
        throw contractError('Login');
    }
    const headOfficeId = readString(value, 'headOfficeId');
    const headOfficeName = readString(value, 'headOfficeName');
    const branchOfficeId = readString(value, 'branchOfficeId');
    const branchOfficeName = readString(value, 'branchOfficeName');
    const displayName = readString(value, 'displayName');
    if (!headOfficeId || !headOfficeName || !branchOfficeId || !branchOfficeName || !displayName) {
        throw contractError('Login');
    }
    return { headOfficeId, headOfficeName, branchOfficeId, branchOfficeName, displayName };
}
export const authApiRepository = {
    async login(request) {
        const path = requireEndpoint(apiConfig.endpoints.login, 'Login');
        // Field names are isolated here until the login contract is confirmed.
        const payload = await httpClient.post(path, {
            headOfficeId: request.headOfficeId,
            branchOfficeId: request.branchOfficeId,
            password: request.password,
        });
        return mapSession(payload);
    },
    async logout() {
        if (!apiConfig.endpoints.logout) {
            return;
        }
        const path = requireEndpoint(apiConfig.endpoints.logout, 'Logout');
        await httpClient.post(path, {});
    },
};
