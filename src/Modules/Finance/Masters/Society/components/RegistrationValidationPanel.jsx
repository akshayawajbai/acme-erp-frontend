import { StatusBadge } from '../../../../../Common/components';
import { formatShortDate, parseLocalIsoDate } from '../../../../../utilities/dates';
import { computeRegistrationValidity } from './societyValidation';

function displayDate(value) {
    const date = parseLocalIsoDate(value || '');
    return date ? formatShortDate(date) : '—';
}

function ValidationCard({ title, number, validity, result }) {
    return (
        <article className={result.warning ? 'society-validation-card is-warning' : 'society-validation-card'}>
            <div className="society-validation-card__head">
                <h4>{title}</h4>
                <StatusBadge status={result.status} />
            </div>
            <dl>
                <dt>Number</dt>
                <dd>{number || '—'}</dd>
                <dt>Valid until</dt>
                <dd>{displayDate(validity)}</dd>
            </dl>
            <p className="society-validation-card__detail" role={result.warning ? 'alert' : undefined}>
                {result.warning ? 'Warning: ' : ''}
                {result.detail}
            </p>
        </article>
    );
}

export function RegistrationValidationPanel({ form, today }) {
    const result12A = computeRegistrationValidity({
        number: form.number12A,
        validity: form.validity12A,
        today,
        appliedLabel:
            form.status12A === 'Applied' && !form.validity12A
                ? '12A application is in progress; validity is pending.'
                : '',
    });
    const result80G = computeRegistrationValidity({
        number: form.number80G,
        validity: form.validity80G,
        today,
    });

    return (
        <>
            <div className="society-validation-grid">
                <ValidationCard
                    title="12A Registration"
                    number={form.number12A}
                    validity={form.validity12A}
                    result={result12A}
                />
                <ValidationCard
                    title="80G Registration"
                    number={form.number80G}
                    validity={form.validity80G}
                    result={result80G}
                />
            </div>
            <p className="society-validation-note">
                Placeholder: results are computed locally from the validity dates entered on the 12A and 80G tabs.
                No external verification is performed.
            </p>
        </>
    );
}
