import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import logoUrl from '../../../Assets/images/acme-logo.svg';
import { Button, ErrorState, LoadingSpinner, PasswordInput, SearchableSelect, Select, ThemeSwitcher } from '../../../Common/components';
import { apiConfig } from '../../../Api_Config/apiConfig';
import { brand } from '../../../constants/brand';
import { appRoutes } from '../../../constants/routes';
import { useAuth } from '../../../Context/AuthContext';
import { BrandBar } from '../../../Layout/BrandBar';
import { officeService } from '../../../services/dataProvider';
import { errorMessage } from '../../../utilities/errors';
export function LoginPage() {
    const { session, login } = useAuth();
    const navigate = useNavigate();
    const [headOffices, setHeadOffices] = useState([]);
    const [branches, setBranches] = useState([]);
    const [headOfficeId, setHeadOfficeId] = useState('');
    const [branchOfficeId, setBranchOfficeId] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [officesLoading, setOfficesLoading] = useState(true);
    const [officesError, setOfficesError] = useState('');
    const [branchesLoading, setBranchesLoading] = useState(false);
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
            return;
        }
        let active = true;
        setBranches([]);
        setBranchesLoading(true);
        officeService
            .getBranchOffices(headOfficeId)
            .then((rows) => {
            if (active) {
                setBranches(rows);
            }
        })
            .catch((error) => {
            if (active) {
                setBranches([]);
                setErrors((current) => ({ ...current, branchOfficeId: errorMessage(error) }));
            }
        })
            .finally(() => {
            if (active) {
                setBranchesLoading(false);
            }
        });
        return () => {
            active = false;
        };
    }, [headOfficeId]);
    if (session) {
        return <Navigate to={appRoutes.dashboard} replace/>;
    }
    function handleHeadOfficeChange(nextId) {
        setHeadOfficeId(nextId);
        setBranchOfficeId('');
        setBranches([]);
        setErrors((current) => ({ ...current, headOfficeId: undefined, branchOfficeId: undefined, form: undefined }));
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
    return (<div className="login-page">
      <BrandBar />
      <main className="login-main">
        <section className="login-card">
          <img className="login-logo" src={logoUrl} alt="ACME"/>
          <h1>Sign in</h1>
          <p className="lede">{brand.productName}</p>
          {apiConfig.dataMode === 'mock' ? (<p className="demo-note">
              Demonstration login for this prototype. Choose a head office, a branch office, and any non-empty
              password to open the sample workspace. This screen is not production security and does not protect
              application data.
            </p>) : (<p className="demo-note">
              API mode is on. Sign-in is sent to the configured login endpoint. A failed request stays on this page.
            </p>)}

          {officesLoading ? <LoadingSpinner label="Loading offices"/> : null}
          {officesError ? <ErrorState message={officesError} onRetry={() => void reloadOffices()}/> : null}

          {!officesLoading && !officesError ? (<form className="stack" onSubmit={(event) => void handleSubmit(event)} noValidate>
              {errors.form ? (<p className="form-error" role="alert">
                  {errors.form}
                </p>) : null}
              <SearchableSelect id="head-office" label="Head Office" required value={headOfficeId} placeholder="Search head office" error={errors.headOfficeId} disabled={submitting} options={headOffices.map((office) => ({
                value: office.id,
                label: `${office.name} — ${office.city}`,
            }))} onChange={handleHeadOfficeChange}/>
              <Select id="branch-office" label="Branch Office" required value={branchOfficeId} placeholder={!headOfficeId ? 'Select a head office first' : branchesLoading ? 'Loading branches' : 'Select branch office'} disabled={!headOfficeId || branchesLoading || submitting} error={errors.branchOfficeId} options={branches.map((office) => ({ value: office.id, label: office.name }))} onChange={(nextId) => {
                setBranchOfficeId(nextId);
                setErrors((current) => ({ ...current, branchOfficeId: undefined, form: undefined }));
            }}/>
              <PasswordInput id="password" label="Password" required value={password} disabled={submitting} error={errors.password} onChange={(next) => {
                setPassword(next);
                setErrors((current) => ({ ...current, password: undefined, form: undefined }));
            }}/>
              <Button className="btn-block" type="submit" variant="primary" size="large" loading={submitting}>
                Login
              </Button>
            </form>) : null}
          <div className="login-theme">
            <ThemeSwitcher />
          </div>
        </section>
      </main>
    </div>);
}
