export function validateLedger(input, existing, currentId) {
    const errors = {};
    const code = input.code.trim();
    const name = input.name.trim();
    if (!code) {
        errors.code = 'Enter a ledger code.';
    }
    else if (existing.some((row) => row.code.toLowerCase() === code.toLowerCase() && row.id !== currentId)) {
        errors.code = 'This ledger code is already in use.';
    }
    if (!name) {
        errors.name = 'Enter a ledger name.';
    }
    if (!input.groupName.trim()) {
        errors.groupName = 'Select a ledger group.';
    }
    if (input.status !== 'Active' && input.status !== 'Inactive') {
        errors.status = 'Select a status.';
    }
    return errors;
}
