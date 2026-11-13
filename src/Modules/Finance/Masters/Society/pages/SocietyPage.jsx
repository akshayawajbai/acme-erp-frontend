import { PageHeader, StatusBadge } from '../../../../../Common/components';
import { breadcrumbsFor, pageDescriptions } from '../../../../../constants/navigation';
import { appRoutes } from '../../../../../constants/routes';
import { MasterPageShell } from '../../shared/MasterPageShell';
import { RowActions } from '../../shared/RowActions';
import { useMasterCrud } from '../../shared/useMasterCrud';
import { SocietyFormPage } from '../components/SocietyFormPage';
import { societyMockRepository } from '../services/societyMockRepository';

const PAGE_TITLE = 'Society / Trust Master';

const formTitles = {
    create: 'Add Society / Trust',
    edit: 'Edit Society / Trust',
    view: 'View Society / Trust',
};

const emptyInput = {
    societyName: '',
    societyTrustType: '',
    societyRegistrationNumber: '',
    trustDocumentNumber: '',
    registrationDate: '',
    branchUsersIncharge: '',

    panStatus: '',
    panNumber: '',
    panName: '',
    panRegistrationDate: '',

    darpanStatus: '',
    darpanId: '',
    darpanRegistrationDate: '',
    darpanName: '',

    tanRegisterNumber: '',
    tanRegisterDate: '',
    tanName: '',

    status12A: '',
    number12A: '',
    validity12A: '',
    name12A: '',

    number80G: '',
    registrationDate80G: '',
    validity80G: '',
    name80G: '',

    fcraStatus: '',
    fcraNumber: '',
    fcraRegistrationDate: '',
    fcraValidity: '',
    fcraNature: '',

    incomeTaxNature: '',
    objectOfSociety: [],

    address: '',
    city: '',
    country: 'IN',
    state: '',
    postalCode: '',
};

const searchFields = ['name', 'registrationNumber', 'panNumber', 'fcraStatus', 'status12A'];

export function SocietyPage() {
    const crud = useMasterCrud(societyMockRepository, {
        entityLabel: 'Society / Trust',
        searchFields,
    });

    const columns = [
        { key: 'name', header: 'Name', className: 'col-name', render: (row) => row.name, sortValue: (row) => row.name },
        {
            key: 'registrationNumber',
            header: 'Registration No',
            className: 'col-code',
            render: (row) => row.registrationNumber || '—',
            sortValue: (row) => row.registrationNumber,
        },
        {
            key: 'panNumber',
            header: 'PAN',
            className: 'col-code',
            render: (row) => row.panNumber || '—',
            sortValue: (row) => row.panNumber,
        },
        {
            key: 'fcraStatus',
            header: 'FCRA Status',
            className: 'col-status',
            render: (row) => <StatusBadge status={row.fcraStatus} />,
            sortValue: (row) => row.fcraStatus,
        },
        {
            key: 'status12A',
            header: '12A Status',
            className: 'col-status',
            render: (row) => <StatusBadge status={row.status12A} />,
            sortValue: (row) => row.status12A,
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

    // Full-page form: crud.modal only carries mode / record here; no Modal component is used.
    if (crud.modal) {
        const { mode, record } = crud.modal;
        const initial = mode === 'create' ? emptyInput : { ...emptyInput, ...record };
        return (
            <section className="master-page">
                <PageHeader
                    title={formTitles[mode]}
                    description={pageDescriptions[appRoutes.mastersSociety]}
                    breadcrumbs={breadcrumbsFor(appRoutes.mastersSociety)}
                />
                <SocietyFormPage
                    key={mode === 'create' ? 'create' : `${record.id}-${mode}`}
                    mode={mode}
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
            </section>
        );
    }

    return (
        <MasterPageShell
            title={PAGE_TITLE}
            description={pageDescriptions[appRoutes.mastersSociety]}
            breadcrumbs={breadcrumbsFor(appRoutes.mastersSociety)}
            addLabel="Add New"
            searchId="society-search"
            searchLabel="Search societies / trusts"
            searchPlaceholder="Name, registration no, PAN, FCRA or 12A status"
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
            caption="Societies and trusts"
            emptyTitle="No societies or trusts yet"
            emptyMessage="Add a society or trust to start the demonstration list."
            deleteOpen={Boolean(crud.deleteTarget)}
            deleteTitle="Delete society / trust?"
            deleteMessage={
                crud.deleteTarget
                    ? `Remove “${crud.deleteTarget.name}” from the demonstration list? This cannot be undone.`
                    : ''
            }
            deleting={crud.deleting}
            deleteError={crud.deleteError}
            onDeleteCancel={() => crud.setDeleteTarget(null)}
            onDeleteConfirm={() => void crud.handleDelete()}
        />
    );
}
