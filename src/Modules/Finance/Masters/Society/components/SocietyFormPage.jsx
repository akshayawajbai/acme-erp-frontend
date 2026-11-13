import { useMemo, useState } from 'react';
import { Button, Input, Select } from '../../../../../Common/components';
import { useToast } from '../../../../../Context/ToastContext';
import { startOfLocalDay } from '../../../../../utilities/dates';
import { DateField } from '../../shared/DateField';
import { FormSection } from '../../shared/FormSection';
import {
    countries,
    fcraNatureOptions,
    panStatusOptions,
    registrationStatusOptions,
    societyObjectOptions,
    statesByCountry,
    status12AOptions,
    userOptions,
} from '../../shared/lookups';
import { TextAreaField } from '../../shared/TextAreaField';
import { RegistrationValidationPanel } from './RegistrationValidationPanel';
import { societyTabs, societyTrustTypeOptions, tabKeyForField } from './societyConstants';
import { validateSociety } from './societyValidation';
import './SocietyFormPage.css';

const FORM_ID = 'society-form';

export function SocietyFormPage({ mode, initial, serverError, saving, onClose, onSubmit }) {
    const [form, setForm] = useState(initial);
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState(societyTabs[0].key);
    const [today] = useState(() => startOfLocalDay(new Date()));
    const { pushToast } = useToast();
    const readOnly = mode === 'view';
    const disabled = readOnly || saving;
    const stateOptions = useMemo(() => statesByCountry[form.country] || [], [form.country]);
    const fcraRegistered = form.fcraStatus === 'Registered';

    const tabsWithErrors = useMemo(() => {
        const keys = new Set();
        Object.keys(errors).forEach((field) => {
            if (errors[field]) {
                keys.add(tabKeyForField(field));
            }
        });
        return keys;
    }, [errors]);

    function updateField(key, value) {
        setForm((current) => {
            const next = { ...current, [key]: value };
            if (key === 'country') {
                next.state = '';
            }
            return next;
        });
        setErrors((current) => {
            const nextErrors = {
                ...current,
                [key]: undefined,
                ...(key === 'country' ? { state: undefined } : {}),
            };
            if (key === 'fcraStatus' && value !== 'Registered') {
                nextErrors.fcraNumber = undefined;
                nextErrors.fcraRegistrationDate = undefined;
                nextErrors.fcraValidity = undefined;
                nextErrors.fcraNature = undefined;
            }
            return nextErrors;
        });
    }

    function toggleObject(value, checked) {
        const current = Array.isArray(form.objectOfSociety) ? form.objectOfSociety : [];
        const next = checked ? [...current, value] : current.filter((item) => item !== value);
        updateField('objectOfSociety', next);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (readOnly) {
            return;
        }
        const nextErrors = validateSociety(form);
        setErrors(nextErrors);
        const fields = Object.keys(nextErrors);
        if (fields.length > 0) {
            setActiveTab(tabKeyForField(fields[0]) || societyTabs[0].key);
            pushToast({ message: nextErrors[fields[0]], tone: 'error' });
            return;
        }
        onSubmit({ ...form });
    }

    function handleTabKeyDown(event, index) {
        let target = -1;
        if (event.key === 'ArrowRight') {
            target = (index + 1) % societyTabs.length;
        } else if (event.key === 'ArrowLeft') {
            target = (index - 1 + societyTabs.length) % societyTabs.length;
        } else if (event.key === 'Home') {
            target = 0;
        } else if (event.key === 'End') {
            target = societyTabs.length - 1;
        }
        if (target < 0) {
            return;
        }
        event.preventDefault();
        setActiveTab(societyTabs[target].key);
        const element = document.getElementById(`society-tab-${societyTabs[target].key}`);
        if (element) {
            element.focus();
        }
    }

    function textInput(key, label, extra) {
        return (
            <Input
                id={`soc-${key}`}
                label={label}
                value={form[key] || ''}
                disabled={disabled}
                error={errors[key]}
                onChange={(value) => updateField(key, value)}
                {...extra}
            />
        );
    }

    function selectInput(key, label, options, extra) {
        return (
            <Select
                id={`soc-${key}`}
                label={label}
                value={form[key] || ''}
                options={options}
                disabled={disabled}
                error={errors[key]}
                onChange={(value) => updateField(key, value)}
                {...extra}
            />
        );
    }

    function dateInput(key, label, extra) {
        return (
            <DateField
                id={`soc-${key}`}
                label={label}
                value={form[key] || ''}
                disabled={disabled}
                error={errors[key]}
                onChange={(value) => updateField(key, value)}
                {...extra}
            />
        );
    }

    function renderPanel() {
        switch (activeTab) {
            case 'info':
                return (
                    <FormSection title="Society Information">
                        {textInput('societyName', 'Society / Trust Name', { required: true })}
                        {selectInput('societyTrustType', 'Society / Trust', societyTrustTypeOptions, { required: true })}
                        {textInput('societyRegistrationNumber', 'Society Registration Number', {
                            required: form.societyTrustType === 'Society',
                        })}
                        {textInput('trustDocumentNumber', 'Trust Document Number', {
                            required: form.societyTrustType === 'Trust',
                        })}
                        {dateInput('registrationDate', 'Registration Date')}
                        {selectInput('branchUsersIncharge', 'Branch Users Incharge', userOptions)}
                    </FormSection>
                );
            case 'pan':
                return (
                    <FormSection title="PAN">
                        {selectInput('panStatus', 'PAN Status', panStatusOptions)}
                        {textInput('panNumber', 'PAN Number', {
                            placeholder: 'AAAAA0000A',
                            required: form.panStatus === 'Available',
                            onChange: (value) => updateField('panNumber', value.toUpperCase().slice(0, 10)),
                        })}
                        {textInput('panName', 'Name as per PAN')}
                        {dateInput('panRegistrationDate', 'PAN Registration Date')}
                    </FormSection>
                );
            case 'darpan':
                return (
                    <FormSection title="DARPAN">
                        {selectInput('darpanStatus', 'DARPAN Status', registrationStatusOptions)}
                        {textInput('darpanId', 'DARPAN ID', { required: form.darpanStatus === 'Registered' })}
                        {dateInput('darpanRegistrationDate', 'DARPAN Registration Date')}
                        {textInput('darpanName', 'Name as per DARPAN')}
                    </FormSection>
                );
            case 'tan':
                return (
                    <FormSection title="TAN">
                        {textInput('tanRegisterNumber', 'TAN Register Number')}
                        {dateInput('tanRegisterDate', 'TAN Register Date')}
                        {textInput('tanName', 'Name as per TAN')}
                    </FormSection>
                );
            case 'a12':
                return (
                    <FormSection title="12A">
                        {selectInput('status12A', '12A Status', status12AOptions)}
                        {textInput('number12A', '12A Number', { required: form.status12A === 'Active' })}
                        {dateInput('validity12A', '12A Validity')}
                        {textInput('name12A', 'Name as per 12A')}
                    </FormSection>
                );
            case 'g80':
                return (
                    <FormSection title="80G">
                        {textInput('number80G', '80G Number')}
                        {dateInput('registrationDate80G', '80G Registration Date')}
                        {dateInput('validity80G', '80G Validity')}
                        {textInput('name80G', 'Name as per 80G')}
                    </FormSection>
                );
            case 'fcra':
                return (
                    <FormSection title="FCRA">
                        {selectInput('fcraStatus', 'FCRA Status', registrationStatusOptions)}
                        {fcraRegistered ? (
                            <>
                                {textInput('fcraNumber', 'FCRA Number', { required: true })}
                                {dateInput('fcraRegistrationDate', 'FCRA Registration Date')}
                                {dateInput('fcraValidity', 'FCRA Validity')}
                                {selectInput('fcraNature', 'FCRA Nature', fcraNatureOptions, { required: true })}
                            </>
                        ) : null}
                    </FormSection>
                );
            case 'tax':
                return (
                    <FormSection title="Income Tax">
                        {textInput('incomeTaxNature', 'Nature of Society / Trust (Income Tax)')}
                        <div className="master-form-span-2">
                            <fieldset className="society-checkgroup" disabled={disabled}>
                                <legend>Object of Society</legend>
                                <div className="society-checkgroup__list">
                                    {societyObjectOptions.map((option, index) => (
                                        <label key={option.value} className="society-checkgroup__item" htmlFor={`soc-object-${index}`}>
                                            <input
                                                id={`soc-object-${index}`}
                                                type="checkbox"
                                                checked={(form.objectOfSociety || []).includes(option.value)}
                                                onChange={(event) => toggleObject(option.value, event.target.checked)}
                                            />
                                            <span>{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                            {errors.objectOfSociety ? <p className="field-error">{errors.objectOfSociety}</p> : null}
                        </div>
                    </FormSection>
                );
            case 'validation':
                return (
                    <FormSection
                        title="Registration Validation"
                        description="Computed from the validity dates on this form. Expired or expiring registrations are flagged."
                    >
                        <RegistrationValidationPanel form={form} today={today} />
                    </FormSection>
                );
            case 'address':
                return (
                    <FormSection title="Address">
                        <div className="master-form-span-2">
                            <TextAreaField
                                id="soc-address"
                                label="Address"
                                value={form.address || ''}
                                disabled={disabled}
                                onChange={(value) => updateField('address', value)}
                            />
                        </div>
                        {textInput('city', 'City')}
                        {selectInput('country', 'Country', countries, { required: true })}
                        {selectInput('state', 'State / Province', stateOptions, {
                            required: true,
                            disabled: disabled || !form.country,
                        })}
                        {textInput('postalCode', 'Postal / Zip Code')}
                    </FormSection>
                );
            default:
                return null;
        }
    }

    return (
        <form id={FORM_ID} className="master-form society-form-page" onSubmit={handleSubmit} noValidate>
            {serverError ? <p className="form-error" role="alert">{serverError}</p> : null}
            <div className="society-tabs" role="tablist" aria-label="Society / Trust details">
                {societyTabs.map((tab, index) => {
                    const selected = tab.key === activeTab;
                    const hasError = tabsWithErrors.has(tab.key);
                    return (
                        <button
                            key={tab.key}
                            id={`society-tab-${tab.key}`}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            aria-controls={`society-panel-${tab.key}`}
                            tabIndex={selected ? 0 : -1}
                            className={hasError ? 'society-tab has-error' : 'society-tab'}
                            onClick={() => setActiveTab(tab.key)}
                            onKeyDown={(event) => handleTabKeyDown(event, index)}
                        >
                            {tab.label}
                            {hasError ? <span className="society-tab__flag" aria-label="has errors">!</span> : null}
                        </button>
                    );
                })}
            </div>
            <div
                id={`society-panel-${activeTab}`}
                className="society-tabpanel"
                role="tabpanel"
                aria-labelledby={`society-tab-${activeTab}`}
            >
                {renderPanel()}
            </div>
            <div className="society-form-actions">
                <Button variant="outline" onClick={onClose} disabled={saving}>
                    {readOnly ? 'Close' : 'Cancel'}
                </Button>
                {readOnly ? null : (
                    <Button variant="primary" type="submit" loading={saving}>
                        Save
                    </Button>
                )}
            </div>
        </form>
    );
}
