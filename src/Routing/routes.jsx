import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../Layout/AppLayout';
import { LoginPage } from '../Modules/Auth/pages/LoginPage';
import { PasswordChangeRequiredPage } from '../Modules/Auth/pages/PasswordChangeRequiredPage';
import { DashboardPage } from '../Modules/Dashboard/pages/DashboardPage';
import {
    ChartOfAccountsPage,
    FixedAssetsPage,
    JournalVoucherPage,
    PaymentVoucherPage,
    PayrollPage,
    ReceiptVoucherPage,
    ReportsPage,
    UtilitiesPage,
} from '../Modules/Finance/pages/FinancePlaceholderPages';
import { LedgerPage } from '../Modules/Finance/Ledger/pages/LedgerPage';
import { BranchOfficePage } from '../Modules/Finance/Masters/BranchOffice/pages/BranchOfficePage';
import { SocietyPage } from '../Modules/Finance/Masters/Society/pages/SocietyPage';
import { LocationPage } from '../Modules/Finance/Masters/Location/pages/LocationPage';
import { ProjectCategoryPage } from '../Modules/Finance/Masters/ProjectCategory/pages/ProjectCategoryPage';
import { ProjectPage } from '../Modules/Finance/Masters/Project/pages/ProjectPage';
import { ProjectMapPage } from '../Modules/Finance/Masters/ProjectMap/pages/ProjectMapPage';
import { BankAccountPage } from '../Modules/Finance/Masters/BankAccount/pages/BankAccountPage';
import { LedgerGroupPage } from '../Modules/Finance/Masters/LedgerGroup/pages/LedgerGroupPage';
import { LedgerMasterPage } from '../Modules/Finance/Masters/Ledger/pages/LedgerMasterPage';
import { LedgerMapPage } from '../Modules/Finance/Masters/LedgerMap/pages/LedgerMapPage';
import { GoverningBodiesPage } from '../Modules/Finance/Masters/GoverningBodies/pages/GoverningBodiesPage';
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
                    <Route path={appRoutes.ledgerGroup} element={<Navigate to={appRoutes.mastersLedgerGroup} replace />} />
                    <Route path={appRoutes.receiptVoucher} element={<ReceiptVoucherPage />} />
                    <Route path={appRoutes.paymentVoucher} element={<PaymentVoucherPage />} />
                    <Route path={appRoutes.journalVoucher} element={<JournalVoucherPage />} />
                    <Route path={appRoutes.financeReportsLegacy} element={<Navigate to={appRoutes.reports} replace />} />
                    <Route path={appRoutes.mastersBranchOffice} element={<BranchOfficePage />} />
                    <Route path={appRoutes.mastersSociety} element={<SocietyPage />} />
                    <Route path={appRoutes.mastersLocation} element={<LocationPage />} />
                    <Route path={appRoutes.mastersProjectCategory} element={<ProjectCategoryPage />} />
                    <Route path={appRoutes.mastersProject} element={<ProjectPage />} />
                    <Route path={appRoutes.mastersProjectMap} element={<ProjectMapPage />} />
                    <Route path={appRoutes.mastersBankAccount} element={<BankAccountPage />} />
                    <Route path={appRoutes.mastersLedgerGroup} element={<LedgerGroupPage />} />
                    <Route path={appRoutes.mastersLedger} element={<LedgerMasterPage />} />
                    <Route path={appRoutes.mastersLedgerMap} element={<LedgerMapPage />} />
                    <Route path={appRoutes.mastersGoverningBodies} element={<GoverningBodiesPage />} />
                    <Route path={appRoutes.fixedAssets} element={<FixedAssetsPage />} />
                    <Route path={appRoutes.payroll} element={<PayrollPage />} />
                    <Route path={appRoutes.reports} element={<ReportsPage />} />
                    <Route path={appRoutes.utilities} element={<UtilitiesPage />} />
                    <Route path={appRoutes.profile} element={<ProfilePage />} />
                    <Route path={appRoutes.preferences} element={<PreferencesPage />} />
                </Route>
            </Route>
            <Route path="*" element={<FallbackRedirect />} />
        </Routes>
    );
}
