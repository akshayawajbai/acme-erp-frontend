import { StatusBadge } from '../../../../../Common/components';
import { breadcrumbsFor, pageDescriptions } from '../../../../../constants/navigation';
import { appRoutes } from '../../../../../constants/routes';
import { formatShortDate, parseLocalIsoDate } from '../../../../../utilities/dates';
import { labelFor, designationOptions } from '../../shared/lookups';
import { maskAadhaar, maskPan } from '../../shared/masks';
import { MasterPageShell } from '../../shared/MasterPageShell';
import { RowActions } from '../../shared/RowActions';
import { statusFromCloseDate } from '../../shared/status';
import { useMasterCrud } from '../../shared/useMasterCrud';
import { GoverningBodyFormModal } from '../components/GoverningBodyFormModal';
import { governingBodyMockRepository } from '../services/governingBodyMockRepository';

const emptyInput = {
    memberName: '',
    fullAddress: '',
    designation: '',
    enrolmentDate: '',
    resignationDate: '',
    panNumber: '',
    aadhaarNumber: '',
    cellNumber: '',
    email: '',
    dateOfBirth: '',
};

// PAN / Aadhaar are intentionally excluded from search so they cannot be inferred from filtering.
const searchFields = [
    'memberName',
    'cellNumber',
    'email',
    (row) => labelFor(designationOptions, row.designation),
];

export function GoverningBodiesPage() {
    const crud = useMasterCrud(governingBodyMockRepository, {
        entityLabel: 'Member',
        searchFields,
    });

    const columns = [
        {
            key: 'memberName',
            header: 'Member',
            className: 'col-name',
            render: (row) => row.memberName,
            sortValue: (row) => row.memberName,
        },
        {
            key: 'designation',
            header: 'Designation',
            render: (row) => labelFor(designationOptions, row.designation),
            sortValue: (row) => row.designation,
        },
        {
            key: 'enrolmentDate',
            header: 'Enrolment',
            render: (row) => {
                const date = parseLocalIsoDate(row.enrolmentDate);
                return date ? formatShortDate(date) : '—';
            },
            sortValue: (row) => row.enrolmentDate,
        },
        {
            key: 'resignationDate',
            header: 'Resignation',
            render: (row) => {
                const date = parseLocalIsoDate(row.resignationDate);
                return date ? formatShortDate(date) : '—';
            },
            sortValue: (row) => row.resignationDate || '9999-12-31',
        },
        {
            key: 'panNumber',
            header: 'PAN',
            className: 'col-code',
            render: (row) => maskPan(row.panNumber),
        },
        {
            key: 'aadhaarNumber',
            header: 'Aadhaar',
            className: 'col-code',
            render: (row) => maskAadhaar(row.aadhaarNumber),
        },
        {
            key: 'cellNumber',
            header: 'Cell',
            render: (row) => row.cellNumber || '—',
            sortValue: (row) => row.cellNumber,
        },
        {
            key: 'email',
            header: 'E-Mail',
            render: (row) => row.email || '—',
            sortValue: (row) => row.email,
        },
        {
            key: 'status',
            header: 'Status',
            className: 'col-status',
            render: (row) => (
                <StatusBadge status={statusFromCloseDate(row.resignationDate, 'Active', 'Inactive')} />
            ),
            sortValue: (row) => statusFromCloseDate(row.resignationDate, 'Active', 'Inactive'),
        },
        {
            key: 'actions',
            header: 'Actions',
            className: 'col-actions',
            hideable: false,
            render: (row) => (
                <RowActions
                    label={row.memberName}
                    onView={() => crud.openModal({ mode: 'view', record: row })}
                    onEdit={() => crud.openModal({ mode: 'edit', record: row })}
                    onDelete={() => {
                        crud.setDeleteError('');
                        crud.setDeleteTarget(row);
                    }}
                />
            ),
        },
    ];

    const initial = !crud.modal || crud.modal.mode === 'create'
        ? emptyInput
        : { ...emptyInput, ...crud.modal.record };

    return (
        <MasterPageShell
            title="Governing Bodies (As per Aadhaar)"
            description={pageDescriptions[appRoutes.mastersGoverningBodies]}
            breadcrumbs={breadcrumbsFor(appRoutes.mastersGoverningBodies)}
            addLabel="Add New"
            searchId="governing-bodies-search"
            searchLabel="Search members"
            searchPlaceholder="Name, designation, cell, or email"
            search={crud.search}
            onSearchChange={crud.setSearch}
            loading={crud.loading}
            error={crud.error}
            refreshing={crud.refreshing}
            onRefresh={() => void crud.load('quiet')}
            onRetry={() => void crud.load('initial')}
            onAdd={() => crud.openModal({ mode: 'create' })}
            rows={crud.rows}
            filtered={crud.filtered}
            columns={columns}
            getRowKey={(row) => row.id}
            caption="Governing body members"
            emptyTitle="No members yet"
            emptyMessage="Add a governing body member to start the demonstration list."
            deleteOpen={Boolean(crud.deleteTarget)}
            deleteTitle="Delete member?"
            deleteMessage={
                crud.deleteTarget
                    ? `Remove “${crud.deleteTarget.memberName}” from the demonstration list? This cannot be undone.`
                    : ''
            }
            deleting={crud.deleting}
            deleteError={crud.deleteError}
            onDeleteCancel={() => crud.setDeleteTarget(null)}
            onDeleteConfirm={() => void crud.handleDelete()}
        >
            {crud.modal ? (
                <GoverningBodyFormModal
                    key={crud.modal.mode === 'create' ? 'create' : `${crud.modal.record.id}-${crud.modal.mode}`}
                    mode={crud.modal.mode}
                    initial={initial}
                    serverError={crud.formError}
                    saving={crud.saving}
                    onClose={() => {
                        if (!crud.saving) {
                            crud.setModal(null);
                        }
                    }}
                    onSubmit={(input) => void crud.handleSubmit(input)}
                />
            ) : null}
        </MasterPageShell>
    );
}
