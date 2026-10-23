import { apiConfig } from './apiConfig';
import { isRecord } from '../utilities/guards';
export class HttpError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
    }
}
function joinUrl(base, path) {
    return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}
async function readErrorDetail(response) {
    try {
        const body = await response.json();
        if (isRecord(body) && typeof body.message === 'string' && body.message.trim()) {
            return ` ${body.message.trim()}`;
        }
    }
    catch {
        return '';
    }
    return '';
}
export async function httpRequest(options) {
    if (!apiConfig.apiBaseUrl) {
        throw new Error('API base URL is not configured. Set VITE_API_BASE_URL.');
    }
    if (!options.path) {
        throw new Error('API endpoint path is not configured.');
    }
    let url;
    try {
        url = new URL(joinUrl(apiConfig.apiBaseUrl, options.path));
    }
    catch {
        throw new Error('API base URL must be an absolute URL, for example http://localhost:5000/api.');
    }
    if (options.query) {
        Object.entries(options.query).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
    }
    const response = await fetch(url.toString(), {
        method: options.method,
        headers: {
            Accept: 'application/json',
            ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        },
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
    if (!response.ok) {
        const detail = await readErrorDetail(response);
        throw new HttpError(`Request failed with status ${response.status}.${detail}`, response.status);
    }
    if (response.status === 204) {
        return undefined;
    }
    const text = await response.text();
    if (!text) {
        return undefined;
    }
    try {
        return JSON.parse(text);
    }
    catch {
        throw new Error('The server response was not valid JSON.');
    }
}
export const httpClient = {
    get(path, query) {
        return httpRequest({ method: 'GET', path, query });
    },
    post(path, body) {
        return httpRequest({ method: 'POST', path, body });
    },
    put(path, body) {
        return httpRequest({ method: 'PUT', path, body });
    },
};
