import {
    collectErrors,
    dateOrder,
    optionalDate,
    requiredDate,
    requiredSelect,
    requiredText,
} from '../../shared/validation';

export function validateLedgerMaster(form) {
    return collectErrors({
        ledgerName: requiredText(form.ledgerName, 'Enter the ledger name.'),
        ledgerGroupId: requiredSelect(form.ledgerGroupId, 'Select a ledger group.'),
        startedOn: requiredDate(form.startedOn, 'Select the started on date.'),
        closedOn: optionalDate(form.closedOn)
            || dateOrder(form.startedOn, form.closedOn, 'Closed on date cannot be before started on date.'),
        projectCategoryId: requiredSelect(form.projectCategoryId, 'Select a project category.'),
    });
}
