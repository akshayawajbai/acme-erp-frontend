import { apiConfig, requireEndpoint } from '../../../Api_Config/apiConfig';
import { httpClient } from '../../../Api_Config/httpClient';
import { contractError, isRecord, readArray, readNumber, readString, } from '../../../utilities/guards';
function mapVoucher(value) {
    if (!isRecord(value)) {
        throw contractError('Dashboard voucher');
    }
    const id = readString(value, 'id');
    const voucherNo = readString(value, 'voucherNo');
    const date = readString(value, 'date');
    const type = readString(value, 'type');
    const party = readString(value, 'party');
    const amount = readNumber(value, 'amount');
    if (!id || !voucherNo || !date || !type || !party || amount === null) {
        throw contractError('Dashboard voucher');
    }
    return { id, voucherNo, date, type, party, amount };
}
function mapTransaction(value) {
    if (!isRecord(value)) {
        throw contractError('Dashboard transaction');
    }
    const id = readString(value, 'id');
    const date = readString(value, 'date');
    const description = readString(value, 'description');
    const account = readString(value, 'account');
    const amount = readNumber(value, 'amount');
    const direction = readString(value, 'direction');
    if (!id || !date || !description || !account || amount === null || (direction !== 'in' && direction !== 'out')) {
        throw contractError('Dashboard transaction');
    }
    return { id, date, description, account, amount, direction };
}
function mapSummary(value) {
    if (!isRecord(value)) {
        throw contractError('Dashboard');
    }
    const totalIncome = readNumber(value, 'totalIncome');
    const totalExpenses = readNumber(value, 'totalExpenses');
    const cashBalance = readNumber(value, 'cashBalance');
    const bankBalance = readNumber(value, 'bankBalance');
    const vouchers = readArray(value.recentVouchers);
    const transactions = readArray(value.recentTransactions);
    if (totalIncome === null || totalExpenses === null || cashBalance === null || bankBalance === null || !vouchers || !transactions) {
        throw contractError('Dashboard');
    }
    return {
        totalIncome,
        totalExpenses,
        cashBalance,
        bankBalance,
        recentVouchers: vouchers.map(mapVoucher),
        recentTransactions: transactions.map(mapTransaction),
    };
}
export const dashboardApiRepository = {
    async getSummary() {
        const path = requireEndpoint(apiConfig.endpoints.dashboard, 'Dashboard');
        const payload = await httpClient.get(path);
        return mapSummary(payload);
    },
};
