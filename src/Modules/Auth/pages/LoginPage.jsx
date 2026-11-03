import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import logoUrl from '../../../Assets/images/acme-logo.svg';
import { Button, ErrorState, LoadingSpinner, PasswordInput, SearchableSelect, Select } from '../../../Common/components';
import { apiConfig } from '../../../Api_Config/apiConfig';
import { brand } from '../../../constants/brand';
import { appRoutes } from '../../../constants/routes';
import { useAuth } from '../../../Context/AuthContext';
import { useToast } from '../../../Context/ToastContext';
import { consumePendingToast } from '../../../Context/toastQueue';
import { officeService } from '../../../services/dataProvider';
import { errorMessage } from '../../../utilities/errors';
import './LoginPage.css';

const rememberStorageKey = 'acme.login.remember';

function readRememberedOffices() {
    try {
        const raw = localStorage.getItem(rememberStorageKey);
        if (!raw) {
            return { rememberMe: false, headOfficeId: '', branchOfficeId: '' };
        }
        const parsed = JSON.parse(raw);
        return {
            rememberMe: true,
            headOfficeId: typeof parsed.headOfficeId === 'string' ? parsed.headOfficeId : '',
            branchOfficeId: typeof parsed.branchOfficeId === 'string' ? parsed.branchOfficeId : '',
        };
    }
    catch {
        return { rememberMe: false, headOfficeId: '', branchOfficeId: '' };
    }
}

export function LoginPage() {
    const { session, login } = useAuth();
    const { pushToast } = useToast();
    const navigate = useNavigate();
    const remembered = readRememberedOffices();
    const [headOffices, setHeadOffices] = useState([]);
    const [branches, setBranches] = useState([]);
    const [headOfficeId, setHeadOfficeId] = useState(remembered.headOfficeId);
    const [branchOfficeId, setBranchOfficeId] = useState(remembered.branchOfficeId);
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(remembered.rememberMe);
    const [errors, setErrors] = useState({});
    const [officesLoading, setOfficesLoading] = useState(true);
    const [officesError, setOfficesError] = useState('');
    const [branchesLoading, setBranchesLoading] = useState(false);
    const [branchLoadError, setBranchLoadError] = useState('');
    const [branchReloadKey, setBranchReloadKey] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let active = true;
        setOfficesLoading(true);
        setOfficesError('');
        officeService
            .getHeadOffices()
            .then((rows) => {
                if (active) {
                    setHeadOffices(rows);
                }
            })
            .catch((error) => {
                if (active) {
                    setOfficesError(errorMessage(error));
                }
            })
            .finally(() => {
                if (active) {
                    setOfficesLoading(false);
                }
            });
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        const pending = consumePendingToast();
        if (pending) {
            pushToast(pending);
        }
    }, [pushToast]);

    useEffect(() => {
        if (!headOfficeId) {
            setBranches([]);
            setBranchesLoading(false);
            setBranchLoadError('');
            return undefined;
        }
        let active = true;
        setBranches([]);
        setBranchesLoading(true);
        setBranchLoadError('');
        officeService
            .getBranchOffices(headOfficeId)
            .then((rows) => {
                if (!active) {
                    return;
                }
                setBranches(rows);
                setBranchOfficeId((current) => (rows.some((row) => row.id === current) ? current : ''));
                if (rows.length === 0) {
                    setBranchLoadError('No branch offices are configured for the selected head office.');
                }
            })
            .catch((error) => {
                if (!active) {
                    return;
                }
                setBranches([]);
                setBranchOfficeId('');
                const message = errorMessage(error);
                setBranchLoadError(message);
                setErrors((current) => ({ ...current, branchOfficeId: message }));
            })
            .finally(() => {
                if (active) {
                    setBranchesLoading(false);
                }
            });
        return () => {
            active = false;
        };
    }, [headOfficeId, branchReloadKey]);

    if (session) {
        return <Navigate to={appRoutes.dashboard} replace />;
    }

    function handleHeadOfficeChange(nextId) {
        setErrors((current) => ({ ...current, headOfficeId: undefined, branchOfficeId: undefined, form: undefined }));
        setBranchLoadError('');
        setBranchOfficeId('');
        if (nextId === headOfficeId) {
            setBranchReloadKey((current) => current + 1);
            return;
        }
        setBranches([]);
        setHeadOfficeId(nextId);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const nextErrors = {};
        if (!headOfficeId) {
            nextErrors.headOfficeId = 'Select a head office.';
        }
        if (!branchOfficeId) {
            nextErrors.branchOfficeId = 'Select a branch office.';
        }
        if (!password.trim()) {
            nextErrors.password = 'Enter a password.';
        }
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            return;
        }
        setSubmitting(true);
        try {
            await login({ headOfficeId, branchOfficeId, password });
            try {
                if (rememberMe) {
                    localStorage.setItem(rememberStorageKey, JSON.stringify({ headOfficeId, branchOfficeId }));
                }
                else {
                    localStorage.removeItem(rememberStorageKey);
                }
            }
            catch {
                // Remember preference is optional when storage is unavailable.
            }
            navigate(appRoutes.dashboard);
        }
        catch (error) {
            setErrors({ form: errorMessage(error) });
        }
        finally {
            setSubmitting(false);
        }
    }

    async function reloadOffices() {
        setOfficesLoading(true);
        setOfficesError('');
        try {
            setHeadOffices(await officeService.getHeadOffices());
        }
        catch (error) {
            setOfficesError(errorMessage(error));
        }
        finally {
            setOfficesLoading(false);
        }
    }

    return (
        <div className="login-page">
            <a className="skip-link" href="#login-form">Skip to sign in</a>
            <div className="login-split">
                <aside className="login-brand-panel" aria-label="ACME">
                    <div className="login-brand-art" aria-hidden="true">
                        <span className="login-orbit login-orbit--one" />
                        <span className="login-orbit login-orbit--two" />
                        <svg className="login-ledger-chart" viewBox="0 0 320 180" role="presentation">
                            <path className="login-ledger-grid" d="M24 24h272M24 68h272M24 112h272M24 156h272M24 24v132M88 24v132M152 24v132M216 24v132M280 24v132" />
                            <path className="login-ledger-area" d="M40 132 L88 108 L136 118 L184 74 L232 90 L280 48 L280 156 L40 156 Z" />
                            <path className="login-ledger-line" d="M40 132 L88 108 L136 118 L184 74 L232 90 L280 48" />
                            <circle cx="88" cy="108" r="4" />
                            <circle cx="184" cy="74" r="4" />
                            <circle cx="280" cy="48" r="4" />
                        </svg>
                    </div>
                    <div className="login-brand-content">
                        <div className="login-brand-mark">
                            <img src={logoUrl} alt="" />
                            <div>
                                <p className="login-brand-product">{brand.productName}</p>
                                <p className="login-brand-kicker">Finance operations</p>
                            </div>
                        </div>
                        <h2>Books that stay clear across every office.</h2>
                        <p>Sign in to ledgers, vouchers, and reports scoped to the head office and branch you select.</p>
                        <ul className="login-brand-points">
                            <li>Office context travels with the session</li>
                            <li>INR figures stay consistent across screens</li>
                            <li>Shortcuts to the finance work you use daily</li>
                        </ul>
                        <div className="login-brand-footer">
                            <a href={brand.phoneHref}>{brand.phoneDisplay}</a>
                            <a href={brand.emailHref}>{brand.email}</a>
                        </div>
                    </div>
                </aside>

                <main className="login-form-panel">
                    <section className="login-form-shell" id="login-form">
                        <div className="login-form-brand">
                            <img className="login-brand-logo" src={logoUrl} alt="" />
                            <div>
                                <p className="login-form-product">{brand.productName}</p>
                                <p className="login-form-kicker">Secure sign-in</p>
                            </div>
                        </div>
                        <h1>Sign in</h1>
                        <p className="login-subtitle">Choose the head office and branch, then enter your password.</p>

                        {officesLoading ? <LoadingSpinner label="Loading offices" /> : null}
                        {officesError ? <ErrorState message={officesError} onRetry={() => void reloadOffices()} /> : null}

                        {!officesLoading && !officesError ? (
                            <form className="stack login-form" onSubmit={(event) => void handleSubmit(event)} noValidate>
                                {errors.form ? (
                                    <p className="form-error" role="alert">
                                        {errors.form}
                                    </p>
                                ) : null}
                                <SearchableSelect
                                    id="head-office"
                                    label="Head Office"
                                    required
                                    value={headOfficeId}
                                    placeholder="Search head office"
                                    error={errors.headOfficeId}
                                    disabled={submitting}
                                    options={headOffices.map((office) => ({
                                        value: office.id,
                                        label: `${office.name} — ${office.city}`,
                                    }))}
                                    onChange={handleHeadOfficeChange}
                                />
                                <Select
                                    id="branch-office"
                                    label="Branch Office"
                                    required
                                    value={branchOfficeId}
                                    placeholder={!headOfficeId ? 'Select a head office first' : branchesLoading ? 'Loading branches' : branchLoadError ? 'No branches available' : 'Select branch office'}
                                    disabled={!headOfficeId || branchesLoading || submitting || Boolean(branchLoadError && branches.length === 0)}
                                    error={errors.branchOfficeId || (!branchesLoading && branchLoadError ? branchLoadError : undefined)}
                                    options={branches.map((office) => ({ value: office.id, label: office.name }))}
                                    onChange={(nextId) => {
                                        setBranchOfficeId(nextId);
                                        setErrors((current) => ({ ...current, branchOfficeId: undefined, form: undefined }));
                                    }}
                                />
                                {headOfficeId && !branchesLoading && branchLoadError && branches.length === 0 ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="small"
                                        onClick={() => setBranchReloadKey((current) => current + 1)}
                                    >
                                        Retry branch offices
                                    </Button>
                                ) : null}
                                <PasswordInput
                                    id="password"
                                    label="Password"
                                    required
                                    value={password}
                                    disabled={submitting}
                                    error={errors.password}
                                    onChange={(next) => {
                                        setPassword(next);
                                        setErrors((current) => ({ ...current, password: undefined, form: undefined }));
                                    }}
                                />
                                <label className="login-remember">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        disabled={submitting}
                                        onChange={(event) => setRememberMe(event.target.checked)}
                                    />
                                    <span>Remember me</span>
                                </label>
                                <Button className="btn-block login-submit" type="submit" variant="primary" size="large" loading={submitting}>
                                    Sign In
                                </Button>
                            </form>
                        ) : null}

                        <p className="login-security-note">
                            {apiConfig.dataMode === 'mock'
                                ? 'Demonstration sign-in. Select a head office and branch, then enter any non-empty password.'
                                : 'Your password is sent to the configured ACME login endpoint.'}
                        </p>
                    </section>
                </main>
            </div>
        </div>
    );
}
