function envValue(value) {
    return (value ?? '').trim();
}
function readMode(value) {
    return envValue(value) === 'api' ? 'api' : 'mock';
}
/**
 * Public frontend configuration only. Do not put secrets in these variables.
 * API paths stay empty until a real contract is supplied.
 */
export const apiConfig = {
    dataMode: readMode(import.meta.env.VITE_DATA_MODE),
    apiBaseUrl: envValue(import.meta.env.VITE_API_BASE_URL),
    endpoints: {
        login: envValue(import.meta.env.VITE_API_LOGIN_PATH),
        logout: envValue(import.meta.env.VITE_API_LOGOUT_PATH),
        headOffices: envValue(import.meta.env.VITE_API_HEAD_OFFICES_PATH),
        branches: envValue(import.meta.env.VITE_API_BRANCHES_PATH),
        dashboard: envValue(import.meta.env.VITE_API_DASHBOARD_PATH),
        ledgers: envValue(import.meta.env.VITE_API_LEDGERS_PATH),
        ledgerGroups: envValue(import.meta.env.VITE_API_LEDGER_GROUPS_PATH),
    },
};
export function requireEndpoint(path, name) {
    if (!apiConfig.apiBaseUrl) {
        throw new Error('API base URL is not configured. Set VITE_API_BASE_URL.');
    }
    if (!path) {
        throw new Error(`${name} endpoint is not configured. Set the matching VITE_API path when the API contract is available.`);
    }
    return path;
}
