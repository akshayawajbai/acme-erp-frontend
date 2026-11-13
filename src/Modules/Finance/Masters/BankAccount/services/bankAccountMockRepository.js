import { parseLocalIsoDate } from '../../../../../utilities/dates';
import { createMockRepository } from '../../shared/createMockRepository';
import { accountTypeOptions, operatedByOptions } from '../../shared/lookups';
import {
    optionalAccountNumber,
    optionalEmail,
    optionalIfsc,
    optionalPhone,
} from '../../shared/validation';
import { bankAccountSeed } from '../mocks/bankAccounts';

function normalize(input, existing, currentId) {
    const accountNumber = String(input.accountNumber || '').trim();
    const customerName = String(input.customerName || '').trim();
    const bankName = String(input.bankName || '').trim();
    const branch = String(input.branch || '').trim();
    const ifsc = String(input.ifsc || '').trim().toUpperCase();
    const accountType = String(input.accountType || '').trim();
    const openDate = String(input.openDate || '').trim();
    const closedDate = String(input.closedDate || '').trim();
    const operatedBy = String(input.operatedBy || '').trim();
    const email = String(input.email || '').trim().toLowerCase();
    const phone = String(input.phone || '').trim();

    if (!accountNumber) {
        throw new Error('Enter an account number.');
    }
    const accountError = optionalAccountNumber(accountNumber);
    if (accountError) {
        throw new Error(accountError);
    }
    if (!customerName || !bankName || !branch) {
        throw new Error('Enter the customer name, bank name, and branch.');
    }
    if (!ifsc) {
        throw new Error('Enter the IFSC code.');
    }
    const ifscError = optionalIfsc(ifsc);
    if (ifscError) {
        throw new Error(ifscError);
    }
    if (!accountTypeOptions.some((item) => item.value === accountType)) {
        throw new Error('Select a valid account type.');
    }
    if (!operatedByOptions.some((item) => item.value === operatedBy)) {
        throw new Error('Select a valid operated by option.');
    }
    const open = parseLocalIsoDate(openDate);
    if (!open) {
        throw new Error('Select the open date.');
    }
    if (closedDate) {
        const closed = parseLocalIsoDate(closedDate);
        if (!closed) {
            throw new Error('Enter a valid closed date.');
        }
        if (closed < open) {
            throw new Error('Closed date cannot be before open date.');
        }
    }
    if (!email) {
        throw new Error('Enter an email address.');
    }
    const emailError = optionalEmail(email);
    if (emailError) {
        throw new Error(emailError);
    }
    if (!phone) {
        throw new Error('Enter a phone number.');
    }
    const phoneError = optionalPhone(phone);
    if (phoneError) {
        throw new Error(phoneError);
    }
    if (existing.some((row) => row.accountNumber === accountNumber && row.id !== currentId)) {
        throw new Error('This account number already exists.');
    }

    return {
        accountNumber,
        customerName,
        bankName,
        branch,
        ifsc,
        accountType,
        openDate,
        closedDate,
        operatedBy,
        branchAddress: String(input.branchAddress || '').trim(),
        email,
        phone,
    };
}

export const bankAccountMockRepository = createMockRepository(bankAccountSeed, normalize, {
    sortFn: (left, right) => left.accountNumber.localeCompare(right.accountNumber, undefined, { numeric: true }),
});
