import { StatusBadge } from '../../../../../Common/components';
import { breadcrumbsFor, pageDescriptions } from '../../../../../constants/navigation';
import { appRoutes } from '../../../../../constants/routes';
import { formatShortDate, parseLocalIsoDate } from '../../../../../utilities/dates';
import { branchOfficeOptions, labelFor, sectorOptions, userOptions } from '../../shared/lookups';
import { MasterPageShell } from '../../shared/MasterPageShell';
import { RowActions } from '../../shared/RowActions';
import { statusFromCloseDate } from '../../shared/status';
import { useMasterCrud } from '../../shared/useMasterCrud';
import { ProjectMapFormModal } from '../components/ProjectMapFormModal';
import { projectOptions } from '../mocks/projectMaps';
import { projectMapMockRepository } from '../services/projectMapMockRepository';

const emptyInput = {
    branchOfficeId: '',
    sectorId: '',
    projectId: '',
    userId: '',
    startedOn: '',
    closedOn: '',
};

function displayDate(value) {
    const date = parseLocalIsoDate(value);
    return date ? formatShortDate(date) : '—';
}

const searchFields = [
    (row) => labelFor(branchOfficeOptions, row.branchOfficeId),
    (row) => labelFor(sectorOptions, row.sectorId),
    (row) => labelFor(projectOptions, row.projectId),
    (row) => labelFor(userOptions, row.userId),
];

export function ProjectMapPage() {
    const crud = useMasterCrud(projectMapMockRepository, {
        entityLabel: 'Project mapping',
        searchFields,
    });

    const columns = [
        {
            key: 'project',
            header: 'Project',
            className: 'col-name',
            render: (row) => labelFor(projectOptions, row.projectId),
            sortValue: (row) => labelFor(projectOptions, row.projectId),
        },
        {
            key: 'branch',
            header: 'Branch Office',
            render: (row) => labelFor(branchOfficeOptions, row.branchOfficeId),
            sortValue: (row) => labelFor(branchOfficeOptions, row.branchOfficeId),
        },
        {
            key: 'sector',
            header: 'Sector',
            render: (row) => labelFor(sectorOptions, row.sectorId),
            sortValue: (row) => labelFor(sectorOptions, row.sectorId),
        },
        {
            key: 'user',
            header: 'User',
            render: (row) => labelFor(userOptions, row.userId),
            sortValue: (row) => labelFor(userOptions, row.userId),
        },
        {
            key: 'startedOn',
            header: 'Started On',
            render: (row) => displayDate(row.startedOn),
            sortValue: (row) => row.startedOn,
        },
        {
            key: 'closedOn',
            header: 'Closed On',
            render: (row) => displayDate(row.closedOn),
            sortValue: (row) => row.closedOn || '9999-12-31',
        },
        {
            key: 'status',
            header: 'Status',
            className: 'col-status',
            render: (row) => <StatusBadge status={statusFromCloseDate(row.closedOn)} />,
            sortValue: (row) => statusFromCloseDate(row.closedOn),
        },
        {
            key: 'actions',
            header: 'Actions',
            className: 'col-actions',
            hideable: false,
            render: (row) => (
                <RowActions
                    label={labelFor(projectOptions, row.projectId)}
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
            title="Project Mapping"
            description={pageDescriptions[appRoutes.mastersProjectMap]}
            breadcrumbs={breadcrumbsFor(appRoutes.mastersProjectMap)}
            addLabel="Add New"
            searchId="project-map-search"
            searchLabel="Search project mappings"
            searchPlaceholder="Project, branch, sector, or user"
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
            caption="Project mappings"
            emptyTitle="No project mappings yet"
            emptyMessage="Add a project mapping to start the demonstration list."
            deleteOpen={Boolean(crud.deleteTarget)}
            deleteTitle="Delete project mapping?"
            deleteMessage={
                crud.deleteTarget
                    ? `Remove the mapping for “${labelFor(projectOptions, crud.deleteTarget.projectId)}” from the demonstration list? This cannot be undone.`
                    : ''
            }
            deleting={crud.deleting}
            deleteError={crud.deleteError}
            onDeleteCancel={() => crud.setDeleteTarget(null)}
            onDeleteConfirm={() => void crud.handleDelete()}
        >
            {crud.modal ? (
                <ProjectMapFormModal
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
