import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import logoUrl from '../../../Assets/images/acme-logo.svg';
import loginAccountingIllustrationUrl from '../../../Assets/images/login-accounting-illustration.svg';
import loginFinanceChartUrl from '../../../Assets/images/login-finance-chart.jpg';
import { Button, ErrorState, LoadingSpinner, PasswordInput, SearchableSelect, Select, ThemeSwitcher } from '../../../Common/components';
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
    const shellRef = useRef(null);
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

    // Align mirrored blur image to the page scene (img + filter:blur — not backdrop-filter).
    useLayoutEffect(() => {
        const shell = shellRef.current;
        if (!shell) {
            return undefined;
        }

        const html = document.documentElement;
        const previousColorScheme = html.style.colorScheme;
        // Pin document color-scheme while login is open — theme flips won't recompose frost away.
        html.style.colorScheme = 'dark';

        const syncFrost = () => {
            const rect = shell.getBoundingClientRect();
            const page = shell.closest('.login-page');
            const pageRect = page
                ? page.getBoundingClientRect()
                : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
            shell.style.setProperty('--frost-x', `${pageRect.left - rect.left}px`);
            shell.style.setProperty('--frost-y', `${pageRect.top - rect.top}px`);
            shell.style.setProperty('--frost-w', `${pageRect.width}px`);
            shell.style.setProperty('--frost-h', `${pageRect.height}px`);

            const img = shell.querySelector('.login-form-shell-frost-bg');
            if (img instanceof HTMLElement) {
                img.style.setProperty('filter', 'blur(60px) saturate(1.4)');
                img.style.setProperty('-webkit-filter', 'blur(60px) saturate(1.4)');
            }
        };

        syncFrost();
        const frame = window.requestAnimationFrame(syncFrost);
        const timer = window.setTimeout(syncFrost, 700);
        window.addEventListener('resize', syncFrost);
        window.addEventListener('scroll', syncFrost, true);
        window.visualViewport?.addEventListener('resize', syncFrost);
        window.visualViewport?.addEventListener('scroll', syncFrost);
        const themeObserver = new MutationObserver(syncFrost);
        themeObserver.observe(html, { attributes: true, attributeFilter: ['data-theme', 'data-theme-mode'] });

        return () => {
            html.style.colorScheme = previousColorScheme;
            window.cancelAnimationFrame(frame);
            window.clearTimeout(timer);
            window.removeEventListener('resize', syncFrost);
            window.removeEventListener('scroll', syncFrost, true);
            window.visualViewport?.removeEventListener('resize', syncFrost);
            window.visualViewport?.removeEventListener('scroll', syncFrost);
            themeObserver.disconnect();
        };
    }, []);

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
        <div
            className="login-page"
            style={{ '--login-page-backdrop': `url("${loginFinanceChartUrl}")` }}
        >
            <a className="skip-link" href="#login-form">Skip to sign in</a>
            <div className="login-page-backdrop" aria-hidden="true" />
            <div className="login-page-overlay" aria-hidden="true" />
            <div className="login-split">
                <aside className="login-brand-panel" aria-label="ACME branding">
                    <div className="login-brand-content">
                        <div className="login-brand-top">
                            <img className="login-brand-logo" src={logoUrl} alt="ACME" />
                            <p className="login-brand-kicker">{brand.productName}</p>
                        </div>
                        <div className="login-brand-copy">
                            <h1>
                                Smarter <span className="login-accent">Finance</span>. Clearer{' '}
                                <span className="login-accent">Decisions</span>.
                            </h1>
                            <p>
                                Manage your accounts, track every transaction, and gain clear financial insights — all in one powerful platform.
                            </p>
                        </div>
                        <div className="login-brand-visual">
                            <img
                                className="login-accounting-art"
                                src={loginAccountingIllustrationUrl}
                                alt="Accounting ledgers, invoices, calculator, and documents for ACME ERP"
                            />
                        </div>
                        <div className="login-brand-footer">
                            <a href={brand.phoneHref}>{brand.phoneDisplay}</a>
                            <a href={brand.emailHref}>{brand.email}</a>
                        </div>
                    </div>
                </aside>

                <main className="login-form-panel">
                    <section className="login-form-shell" id="login-form" ref={shellRef}>
                        <div className="login-form-shell-frost" aria-hidden="true">
                            <img
                                className="login-form-shell-frost-bg"
                                src={loginFinanceChartUrl}
                                alt=""
                                draggable={false}
                            />
                            <div className="login-form-shell-frost-tint" />
                        </div>
                        <h2>Welcome Back!</h2>
                        <p className="login-subtitle">Sign in to your ACME account to continue.</p>

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

                        <div className="login-theme">
                            <ThemeSwitcher />
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
