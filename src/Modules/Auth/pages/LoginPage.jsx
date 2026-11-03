import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import logoUrl from '../../../Assets/images/acme-logo.svg';
import { Button, ErrorState, LoadingSpinner, PasswordInput, SearchableSelect, Select } from '../../../Common/components';
import { apiConfig } from '../../../Api_Config/apiConfig';
import { brand } from '../../../constants/brand';
import { appRoutes } from '../../../constants/routes';
import { useAuth } from '../../../Context/AuthContext';
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
                <aside className="login-brand-panel" aria-label="ACME branding">
                    <div className="login-brand-content">
                        <div className="login-brand-top">
                            <img className="login-brand-logo" src={logoUrl} alt="ACME" />
                            <p className="login-brand-kicker">{brand.productName}</p>
                        </div>
                        <div className="login-brand-copy">
                            <h1>Finance records, kept in one workspace.</h1>
                            <p>
                                Sign in to the office you work for and continue with ledgers, vouchers, and reports.
                            </p>
                        </div>
                        <ul className="login-highlights">
                            <li>Office-aware sign-in for head office and branch</li>
                            <li>Ledgers, vouchers, and reports in one navigation</li>
                            <li>Light and dark workspace on this device</li>
                        </ul>
                        <div className="login-brand-visual" aria-hidden="true">
                            <svg className="login-mark" viewBox="0 0 480 96" role="img">
                                <title>Ledger rules</title>
                                <path d="M0 16h480M0 48h480M0 80h480" stroke="rgba(255,255,255,0.16)" />
                                <path d="M0 48h280" stroke="#00ACD2" strokeWidth="2" />
                            </svg>
                        </div>
                        <div className="login-brand-footer">
                            <a href={brand.phoneHref}>{brand.phoneDisplay}</a>
                            <a href={brand.emailHref}>{brand.email}</a>
                        </div>
                    </div>
                </aside>

                <main className="login-form-panel">
                    <section className="login-form-shell" id="login-form">
                        <h2>Sign in</h2>
                        <p className="login-subtitle">Choose your office, then enter your password.</p>

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
                                ? 'Your session is protected for demonstration use. Select a head office and branch, then enter any non-empty password.'
                                : 'Your credentials are sent securely to the configured ACME login endpoint.'}
                        </p>
                    </section>
                </main>
            </div>
        </div>
    );
}
