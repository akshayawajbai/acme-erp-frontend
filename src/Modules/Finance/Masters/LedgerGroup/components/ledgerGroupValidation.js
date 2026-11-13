import { collectErrors, requiredSelect, requiredText } from '../../shared/validation';

export function validateLedgerGroup(form) {
    return collectErrors({
        ledgerNature: requiredSelect(form.ledgerNature, 'Select a ledger nature.'),
        ledgerGroupName: requiredText(form.ledgerGroupName, 'Enter the ledger group name.'),
    });
}
