import { apiConfig } from './apiConfig';
import { isRecord } from '../utilities/guards';

/**
 * Returns the full Authorization header value, or an empty string when no
 * credential is available. This client does not store tokens.
 * Future authentication can register a provider without changing requests.
 */
let readAuthorizationHeader = () => '';

export function setAuthorizationHeaderProvider(provider) {
    if (provider != null && typeof provider !== 'function') {
        throw new Error('Authorization header provider must be a function.');
    }
    readAuthorizationHeader = provider ?? (() => '');
}

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

function isAbortError(error) {
    return isRecord(error) && error.name === 'AbortError';
}

function authorizationHeader(options) {
    const direct = typeof options.authorization === 'string' ? options.authorization.trim() : '';
    if (direct) {
        return direct;
    }
    const provided = readAuthorizationHeader();
    if (typeof provided === 'string' && provided.trim()) {
        return provided.trim();
    }
    return '';
}

async function readServerMessage(response) {
    let text = '';
    try {
        text = await response.text();
    } catch {
        return '';
    }
    const trimmed = text.trim();
    if (!trimmed) {
        return '';
    }
    try {
        const body = JSON.parse(trimmed);
        if (isRecord(body) && typeof body.message === 'string' && body.message.trim()) {
            return body.message.trim();
        }
    } catch {
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
    } catch {
        throw new Error(
            'API base URL must be an absolute URL, for example http://localhost:5000/api.',
        );
    }
    if (options.query) {
        Object.entries(options.query).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
    }
    const headers = {
        Accept: 'application/json',
        ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    };
    const authorization = authorizationHeader(options);
    if (authorization) {
        headers.Authorization = authorization;
    }
    let response;
    try {
        response = await fetch(url.toString(), {
            method: options.method,
            headers,
            body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
            signal: options.signal,
        });
    } catch (error) {
        if (isAbortError(error)) {
            throw error;
        }
        throw new HttpError(
            'The server could not be reached. Check your connection and try again.',
            null,
        );
    }
    if (!response.ok) {
        const serverMessage = await readServerMessage(response);
        const message = serverMessage || `Request failed with status ${response.status}.`;
        throw new HttpError(message, response.status);
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
    } catch {
        throw new HttpError('The server response was not valid JSON.', response.status);
    }
}

export const httpClient = {
    get(path, query, requestOptions) {
        return httpRequest({
            method: 'GET',
            path,
            query,
            signal: requestOptions?.signal,
            authorization: requestOptions?.authorization,
        });
    },
    post(path, body, requestOptions) {
        return httpRequest({
            method: 'POST',
            path,
            body,
            signal: requestOptions?.signal,
            authorization: requestOptions?.authorization,
        });
    },
    put(path, body, requestOptions) {
        return httpRequest({
            method: 'PUT',
            path,
            body,
            signal: requestOptions?.signal,
            authorization: requestOptions?.authorization,
        });
    },
    delete(path, requestOptions) {
        return httpRequest({
            method: 'DELETE',
            path,
            query: requestOptions?.query,
            signal: requestOptions?.signal,
            authorization: requestOptions?.authorization,
        });
    },
};
