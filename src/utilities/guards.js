export function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
export function readString(record, key) {
    const value = record[key];
    return typeof value === 'string' && value.trim() ? value : null;
}
export function readNumber(record, key) {
    const value = record[key];
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
}
export function readArray(value) {
    return Array.isArray(value) ? value : null;
}
export function contractError(resource) {
    return new Error(`${resource} response does not match the frontend model. Update the API mapper when the service contract is available.`);
}
