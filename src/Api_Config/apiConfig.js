function envValue(value) {
    return (value ?? '').trim();
}

export function readDataMode(value) {
    const mode = envValue(value);
    if (mode === 'mock' || mode === 'api') {
        return mode;
    }
    const shown = mode ? `"${mode}"` : 'empty';
    throw new Error(
        `VITE_DATA_MODE must be "mock" or "api". Received ${shown}. The app does not fall back to mock data.`,
    );
}

/**
 * Public frontend configuration only. Do not put secrets in these variables.
 * API paths stay empty until a real contract is supplied.
 * API mode requires VITE_API_BASE_URL and never falls back to mock data.
 */
export function readApiConfig(env) {
    const source = env ?? {};
    const dataMode = readDataMode(source.VITE_DATA_MODE);
    const apiBaseUrl = envValue(source.VITE_API_BASE_URL);
    if (dataMode === 'api' && !apiBaseUrl) {
        throw new Error(
            'API base URL is not configured. Set VITE_API_BASE_URL. API mode does not fall back to mock data.',
        );
    }
    return {
        dataMode,
        apiBaseUrl,
        endpoints: {
            login: envValue(source.VITE_API_LOGIN_PATH),
            logout: envValue(source.VITE_API_LOGOUT_PATH),
            headOffices: envValue(source.VITE_API_HEAD_OFFICES_PATH),
            branches: envValue(source.VITE_API_BRANCHES_PATH),
            dashboard: envValue(source.VITE_API_DASHBOARD_PATH),
            ledgers: envValue(source.VITE_API_LEDGERS_PATH),
            ledgerGroups: envValue(source.VITE_API_LEDGER_GROUPS_PATH),
        },
    };
}

export const apiConfig = readApiConfig(import.meta.env);

export function requireEndpoint(path, name) {
    if (!apiConfig.apiBaseUrl) {
        throw new Error(
            'API base URL is not configured. Set VITE_API_BASE_URL. API mode does not fall back to mock data.',
        );
    }
    if (!path) {
        throw new Error(
            `${name} endpoint is not configured. Set the matching VITE_API path when the API contract is available.`,
        );
    }
    return path;
}
