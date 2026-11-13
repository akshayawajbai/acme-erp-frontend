import { StatusBadge } from '../../../../../Common/components';
import { breadcrumbsFor, pageDescriptions } from '../../../../../constants/navigation';
import { appRoutes } from '../../../../../constants/routes';
import { labelFor, countries, headOfficeOptions, statesByCountry } from '../../shared/lookups';
import { MasterPageShell } from '../../shared/MasterPageShell';
import { RowActions } from '../../shared/RowActions';
import { useMasterCrud } from '../../shared/useMasterCrud';
import { BranchOfficeFormModal } from '../components/BranchOfficeFormModal';
import { branchOfficeMockRepository } from '../services/branchOfficeMockRepository';

const emptyInput = {
    headOfficeId: '',
    code: '',
    name: '',
    deploymentModel: '',
    personIncharge: '',
    mobileNo: '',
    phoneNo: '',
    email: '',
    address: '',
    city: '',
    country: 'IN',
    state: '',
    postalCode: '',
    thirdPartyCode: '',
};

export function BranchOfficePage() {
    const crud = useMasterCrud(branchOfficeMockRepository, {
        entityLabel: 'Branch office',
        searchFields: [
            'code',
            'name',
            'city',
            'email',
            (row) => labelFor(headOfficeOptions, row.headOfficeId),
        ],
    });

    const columns = [
        { key: 'code', header: 'Code', className: 'col-code', render: (row) => row.code, sortValue: (row) => row.code },
        { key: 'name', header: 'Name', className: 'col-name', render: (row) => row.name, sortValue: (row) => row.name },
        {
            key: 'headOffice',
            header: 'Head Office',
            render: (row) => labelFor(headOfficeOptions, row.headOfficeId),
            sortValue: (row) => labelFor(headOfficeOptions, row.headOfficeId),
        },
        {
            key: 'deployment',
            header: 'Deployment',
            render: (row) => row.deploymentModel,
            sortValue: (row) => row.deploymentModel,
        },
        {
            key: 'location',
            header: 'City / State',
            render: (row) => {
                const state = (statesByCountry[row.country] || []).find((item) => item.value === row.state);
                return `${row.city || '—'}, ${state?.label || row.state || '—'}`;
            },
            sortValue: (row) => row.city,
        },
        {
            key: 'country',
            header: 'Country',
            render: (row) => labelFor(countries, row.country),
            sortValue: (row) => row.country,
        },
        {
            key: 'status',
            header: 'Status',
            className: 'col-status',
            render: () => <StatusBadge status="Active" />,
            sortValue: () => 'Active',
        },
        {
            key: 'actions',
            header: 'Actions',
            className: 'col-actions',
            hideable: false,
            render: (row) => (
                <RowActions
                    label={row.name}
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

    const initial = crud.modal?.mode === 'create' || !crud.modal
        ? emptyInput
        : { ...crud.modal.record };

    return (
        <MasterPageShell
            title="Branch Office"
            description={pageDescriptions[appRoutes.mastersBranchOffice]}
            breadcrumbs={breadcrumbsFor(appRoutes.mastersBranchOffice)}
            addLabel="Add New"
            searchId="branch-office-search"
            searchLabel="Search branch offices"
            searchPlaceholder="Code, name, city, or email"
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
            caption="Branch offices"
            emptyTitle="No branch offices yet"
            emptyMessage="Add a branch office to start the demonstration list."
            deleteOpen={Boolean(crud.deleteTarget)}
            deleteTitle="Delete branch office?"
            deleteMessage={
                crud.deleteTarget
                    ? `Remove “${crud.deleteTarget.code} — ${crud.deleteTarget.name}” from the demonstration list? This cannot be undone.`
                    : ''
            }
            deleting={crud.deleting}
            deleteError={crud.deleteError}
            onDeleteCancel={() => crud.setDeleteTarget(null)}
            onDeleteConfirm={() => void crud.handleDelete()}
        >
            {crud.modal ? (
                <BranchOfficeFormModal
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
