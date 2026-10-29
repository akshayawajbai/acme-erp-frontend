import { dashboardMock } from '../mocks/dashboardMock';
import { delay } from '../../../utilities/delay';

export const dashboardMockRepository = {
    async getSummary() {
        await delay(400);
        return {
            ...dashboardMock,
            monthlyTrend: dashboardMock.monthlyTrend.map((row) => ({ ...row })),
            expenseBreakdown: dashboardMock.expenseBreakdown.map((row) => ({ ...row })),
            recentVouchers: dashboardMock.recentVouchers.map((row) => ({ ...row })),
            recentTransactions: dashboardMock.recentTransactions.map((row) => ({ ...row })),
        };
    },
};
