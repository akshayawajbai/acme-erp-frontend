export const dashboardMock = {
    totalIncome: 1845000,
    totalExpenses: 1267500,
    cashBalance: 245000,
    bankBalance: 980250,
    recentVouchers: [
        { id: 'v-24018', voucherNo: 'RV-24018', date: '2026-10-18', type: 'Receipt', party: 'Greenfield Traders', amount: 85000 },
        { id: 'v-24044', voucherNo: 'PV-24044', date: '2026-10-17', type: 'Payment', party: 'City Power Supply', amount: 12600 },
        { id: 'v-24009', voucherNo: 'JV-24009', date: '2026-10-16', type: 'Journal', party: 'Depreciation Entry', amount: 4500 },
        { id: 'v-24017', voucherNo: 'RV-24017', date: '2026-10-15', type: 'Receipt', party: 'Harbour School', amount: 150000 },
        { id: 'v-24043', voucherNo: 'PV-24043', date: '2026-10-14', type: 'Payment', party: 'Metro Stationery', amount: 7800 },
    ],
    recentTransactions: [
        { id: 't-1', date: '2026-10-18', description: 'Receipt from Greenfield Traders', account: 'State Bank Current Account', amount: 85000, direction: 'in' },
        { id: 't-2', date: '2026-10-17', description: 'Electricity payment', account: 'Cash in Hand', amount: 12600, direction: 'out' },
        { id: 't-3', date: '2026-10-16', description: 'Donation received', account: 'Donation Income', amount: 25000, direction: 'in' },
        { id: 't-4', date: '2026-10-15', description: 'School fee collection', account: 'State Bank Current Account', amount: 150000, direction: 'in' },
        { id: 't-5', date: '2026-10-14', description: 'Stationery purchase', account: 'Cash in Hand', amount: 7800, direction: 'out' },
    ],
};
