import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../Layout/AppLayout';
import { LoginPage } from '../Modules/Auth/pages/LoginPage';
import { PasswordChangeRequiredPage } from '../Modules/Auth/pages/PasswordChangeRequiredPage';
import { DashboardPage } from '../Modules/Dashboard/pages/DashboardPage';
import {
    ChartOfAccountsPage,
    JournalVoucherPage,
    LedgerGroupPage,
    PaymentVoucherPage,
    ReceiptVoucherPage,
    ReportsPage,
} from '../Modules/Finance/pages/FinancePlaceholderPages';
import { LedgerPage } from '../Modules/Finance/Ledger/pages/LedgerPage';
import { PreferencesPage } from '../Modules/Account/pages/PreferencesPage';
import { ProfilePage } from '../Modules/Account/pages/ProfilePage';
import { appRoutes } from '../constants/routes';
import { useAuth } from '../Context/AuthContext';
import { isPasswordChangeRequired } from '../utilities/session';
import { ProtectedRoute } from './ProtectedRoute';

function FallbackRedirect() {
    const { session } = useAuth();
    if (!session) {
        return <Navigate to={appRoutes.login} replace />;
    }
    if (isPasswordChangeRequired(session)) {
        return <Navigate to={appRoutes.passwordChangeRequired} replace />;
    }
    return <Navigate to={appRoutes.dashboard} replace />;
}

export function AppRoutes() {
    return (
        <Routes>
            <Route path={appRoutes.login} element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
                <Route
                    path={appRoutes.passwordChangeRequired}
                    element={<PasswordChangeRequiredPage />}
                />
                <Route element={<AppLayout />}>
                    <Route path={appRoutes.dashboard} element={<DashboardPage />} />
                    <Route path={appRoutes.chartOfAccounts} element={<ChartOfAccountsPage />} />
                    <Route path={appRoutes.ledger} element={<LedgerPage />} />
                    <Route path={appRoutes.ledgerGroup} element={<LedgerGroupPage />} />
                    <Route path={appRoutes.receiptVoucher} element={<ReceiptVoucherPage />} />
                    <Route path={appRoutes.paymentVoucher} element={<PaymentVoucherPage />} />
                    <Route path={appRoutes.journalVoucher} element={<JournalVoucherPage />} />
                    <Route path={appRoutes.reports} element={<ReportsPage />} />
                    <Route path={appRoutes.profile} element={<ProfilePage />} />
                    <Route path={appRoutes.preferences} element={<PreferencesPage />} />
                </Route>
            </Route>
            <Route path="*" element={<FallbackRedirect />} />
        </Routes>
    );
}
