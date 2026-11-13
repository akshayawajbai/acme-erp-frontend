import { collectErrors, requiredSelect } from '../../shared/validation';

export function validateLedgerMap(form) {
    return collectErrors({
        ledgerId: requiredSelect(form.ledgerId, 'Select a ledger.'),
        fdInvestmentType: requiredSelect(form.fdInvestmentType, 'Select an FD investment type.'),
    });
}
