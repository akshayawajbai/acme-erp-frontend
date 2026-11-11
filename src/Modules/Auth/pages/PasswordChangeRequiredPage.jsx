import { Navigate } from 'react-router-dom';
import logoUrl from '../../../Assets/images/acme-logo.svg';
import { Button } from '../../../Common/components';
import { brand } from '../../../constants/brand';
import { appRoutes } from '../../../constants/routes';
import { useAuth } from '../../../Context/AuthContext';
import { useLogoutFlow } from '../../../Hooks/useLogoutFlow';
import { LogoutConfirm } from '../../../Layout/LogoutConfirm';
import { isPasswordChangeRequired } from '../../../utilities/session';
import './LoginPage.css';

/**
 * Authenticated holding state when the login API reports passwordChangeRequired.
 * No password-change endpoint or form contract has been supplied yet.
 */
export function PasswordChangeRequiredPage() {
    const { session } = useAuth();
    const { confirmOpen, busy, requestLogout, confirmLogout, cancelLogout } = useLogoutFlow();

    if (!session) {
        return <Navigate to={appRoutes.login} replace />;
    }
    if (!isPasswordChangeRequired(session)) {
        return <Navigate to={appRoutes.dashboard} replace />;
    }

    return (
        <div className="login-page">
            <div className="login-split">
                <aside className="login-brand-panel" aria-label="ACME">
                    <div className="login-brand-content">
                        <div className="login-brand-mark">
                            <img src={logoUrl} alt="" />
                            <div>
                                <p className="login-brand-product">{brand.productName}</p>
                                <p className="login-brand-kicker">Finance operations</p>
                            </div>
                        </div>
                        <h2>Password change required</h2>
                        <p>
                            Your account signed in successfully, but the server requires a password
                            change before normal application access.
                        </p>
                    </div>
                </aside>
                <main className="login-form-panel">
                    <section className="login-form-shell">
                        <div className="login-form-brand">
                            <img className="login-brand-logo" src={logoUrl} alt="" />
                            <div>
                                <p className="login-form-product">{brand.productName}</p>
                                <p className="login-form-kicker">Pending action</p>
                            </div>
                        </div>
                        <h1>Change password pending</h1>
                        <p className="login-subtitle">
                            Signed in as {session.displayName}. The password-change API contract and
                            UI have not been supplied yet. Normal routes stay blocked until that
                            flow is completed.
                        </p>
                        <p className="form-error" role="status">
                            Backend password-change endpoint and form are still required. Do not
                            invent a change-password API from the frontend.
                        </p>
                        <Button
                            className="btn-block login-submit"
                            type="button"
                            variant="outline"
                            size="large"
                            loading={busy}
                            onClick={requestLogout}
                        >
                            Log out
                        </Button>
                    </section>
                </main>
            </div>
            <LogoutConfirm
                open={confirmOpen}
                busy={busy}
                onConfirm={() => void confirmLogout()}
                onCancel={cancelLogout}
            />
        </div>
    );
}
