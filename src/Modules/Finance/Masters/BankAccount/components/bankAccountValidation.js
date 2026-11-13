import {
    collectErrors,
    dateOrder,
    optionalAccountNumber,
    optionalDate,
    optionalIfsc,
    requiredDate,
    requiredEmail,
    requiredPhone,
    requiredSelect,
    requiredText,
} from '../../shared/validation';

export function validateBankAccount(form) {
    return collectErrors({
        accountNumber: requiredText(form.accountNumber, 'Enter an account number.')
            || optionalAccountNumber(form.accountNumber),
        customerName: requiredText(form.customerName, 'Enter the customer name.'),
        bankName: requiredText(form.bankName, 'Enter the bank name.'),
        branch: requiredText(form.branch, 'Enter the branch.'),
        ifsc: requiredText(form.ifsc, 'Enter the IFSC code.') || optionalIfsc(form.ifsc),
        accountType: requiredSelect(form.accountType, 'Select an account type.'),
        openDate: requiredDate(form.openDate, 'Select the open date.'),
        closedDate: optionalDate(form.closedDate)
            || dateOrder(form.openDate, form.closedDate, 'Closed date cannot be before open date.'),
        operatedBy: requiredSelect(form.operatedBy, 'Select operated by.'),
        email: requiredEmail(form.email),
        phone: requiredPhone(form.phone, 'Enter a phone number.'),
    });
}
