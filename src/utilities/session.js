import { isRecord, readString } from './guards';
const SESSION_KEY = 'acme.erp.session';
function isSession(value) {
    if (!isRecord(value)) {
        return false;
    }
    return Boolean(readString(value, 'headOfficeId') &&
        readString(value, 'headOfficeName') &&
        readString(value, 'branchOfficeId') &&
        readString(value, 'branchOfficeName') &&
        readString(value, 'displayName'));
}
export function readSession() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
        return null;
    }
    try {
        const parsed = JSON.parse(raw);
        if (!isSession(parsed)) {
            sessionStorage.removeItem(SESSION_KEY);
            return null;
        }
        return {
            headOfficeId: parsed.headOfficeId,
            headOfficeName: parsed.headOfficeName,
            branchOfficeId: parsed.branchOfficeId,
            branchOfficeName: parsed.branchOfficeName,
            displayName: parsed.displayName,
        };
    }
    catch {
        sessionStorage.removeItem(SESSION_KEY);
        return null;
    }
}
export function writeSession(session) {
    const stored = {
        headOfficeId: session.headOfficeId,
        headOfficeName: session.headOfficeName,
        branchOfficeId: session.branchOfficeId,
        branchOfficeName: session.branchOfficeName,
        displayName: session.displayName,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(stored));
}
export function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
}
