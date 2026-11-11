import { isRecord, readNumber, readString } from './guards';

const SESSION_KEY = 'acme.erp.session';

function readOptionalString(record, key) {
    const value = record[key];
    return typeof value === 'string' ? value : null;
}

function readBoolean(record, key) {
    const value = record[key];
    return typeof value === 'boolean' ? value : null;
}

function hasDisplayFields(value) {
    return Boolean(
        readString(value, 'headOfficeId') &&
            readString(value, 'headOfficeName') &&
            readOptionalString(value, 'branchOfficeId') !== null &&
            readOptionalString(value, 'branchOfficeName') !== null &&
            readString(value, 'displayName'),
    );
}

function hasApiTokenFields(value) {
    const accessToken = readString(value, 'accessToken');
    const tokenType = readString(value, 'tokenType');
    const expiresInMinutes = readNumber(value, 'expiresInMinutes');
    const loggedInAt = readNumber(value, 'loggedInAt');
    return Boolean(
        accessToken &&
            tokenType &&
            expiresInMinutes !== null &&
            expiresInMinutes > 0 &&
            loggedInAt !== null &&
            loggedInAt > 0,
    );
}

function isSessionExpired(session) {
    if (!session.accessToken) {
        return false;
    }
    if (
        typeof session.expiresInMinutes !== 'number' ||
        session.expiresInMinutes <= 0 ||
        typeof session.loggedInAt !== 'number' ||
        session.loggedInAt <= 0
    ) {
        return true;
    }
    const expiresAtMs = session.loggedInAt + session.expiresInMinutes * 60 * 1000;
    return Date.now() >= expiresAtMs;
}

function normalizeSession(value) {
    if (!isRecord(value) || !hasDisplayFields(value)) {
        return null;
    }

    const passwordChangeRequired = readBoolean(value, 'passwordChangeRequired');
    const base = {
        headOfficeId: value.headOfficeId.trim(),
        headOfficeName: value.headOfficeName.trim(),
        branchOfficeId: typeof value.branchOfficeId === 'string' ? value.branchOfficeId : '',
        branchOfficeName: typeof value.branchOfficeName === 'string' ? value.branchOfficeName : '',
        displayName: value.displayName.trim(),
        passwordChangeRequired: passwordChangeRequired === true,
    };

    const accessToken = readString(value, 'accessToken');
    if (!accessToken) {
        return base;
    }

    if (!hasApiTokenFields(value)) {
        return null;
    }

    const userId = readNumber(value, 'userId');
    const roleId = readNumber(value, 'roleId');
    const userType = readNumber(value, 'userType');
    const passwordStatus = readNumber(value, 'passwordStatus');
    const userName = readString(value, 'userName');
    const firstName = readOptionalString(value, 'firstName');
    const lastName = readOptionalString(value, 'lastName');
    const userRole = readOptionalString(value, 'userRole');
    const headOfficeCode = readOptionalString(value, 'headOfficeCode');
    const branchCode = readOptionalString(value, 'branchCode');

    if (
        userId === null ||
        roleId === null ||
        userType === null ||
        passwordStatus === null ||
        !userName ||
        firstName === null ||
        lastName === null ||
        userRole === null ||
        headOfficeCode === null ||
        branchCode === null
    ) {
        return null;
    }

    return {
        ...base,
        accessToken: value.accessToken,
        tokenType: value.tokenType.trim(),
        expiresInMinutes: value.expiresInMinutes,
        loggedInAt: value.loggedInAt,
        userId,
        userName,
        firstName,
        lastName,
        roleId,
        userRole,
        userType,
        headOfficeCode,
        branchCode,
        passwordStatus,
    };
}

export function readSession() {
    if (typeof sessionStorage === 'undefined') {
        return null;
    }
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
        return null;
    }
    try {
        const parsed = JSON.parse(raw);
        const session = normalizeSession(parsed);
        if (!session) {
            sessionStorage.removeItem(SESSION_KEY);
            return null;
        }
        if (isSessionExpired(session)) {
            sessionStorage.removeItem(SESSION_KEY);
            return null;
        }
        return session;
    } catch {
        sessionStorage.removeItem(SESSION_KEY);
        return null;
    }
}

export function writeSession(session) {
    const stored = normalizeSession(session);
    if (!stored) {
        throw new Error('Cannot store an incomplete or invalid session.');
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(stored));
}

export function clearSession() {
    if (typeof sessionStorage === 'undefined') {
        return;
    }
    sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Full Authorization header value for the active session, or empty when none.
 * Reads sessionStorage on every call so the token is never captured once at boot.
 * Never log or display this value.
 */
export function getAuthorizationHeader() {
    const session = readSession();
    if (!session?.accessToken || !session?.tokenType) {
        return '';
    }
    return `${session.tokenType} ${session.accessToken}`;
}

export function isPasswordChangeRequired(session) {
    return Boolean(session && session.passwordChangeRequired === true);
}
